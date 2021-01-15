const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const { userService } = require('../service');
const { KeywordByDate, TotalKeyword, Keyword, User } = require('../models');
const jwt = require('../modules/jwt')
const { smtpTransport } = require('../config/email');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { response } = require('express');

var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
  return ranNum;
}
module.exports ={
  sendEmail : async(req, res) => {
    const number = generateRandom(111111, 999999)
    const { email } = req.body;

    const mailOptions = {
        from: "4Most",
        to: email,
        subject: "[4Most]인증 관련 이메일 입니다",
        text: "오른쪽 숫자 6자리를 입력해주세요 : [" + number + "]"
    };
    try{
      const result = await smtpTransport.sendMail(mailOptions)
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.AUTH_EMAIL_SUCCESS, {
        number: number
      }))
      smtpTransport.close();
    } catch (error) {
      console.error(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.AUTH_EMAIL_FAIL));
    }
  },

  signup: async (req, res) => {
    const { email, password, passwordConfirm, userName } = req.body; 
    if(!email || !password || !passwordConfirm || !userName) {
      console.log('필요한 값이 없습니다!');
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try{
      const alreadyEmail = await userService.emailCheck(email);
      if(alreadyEmail){
        console.log('이미 존재하는 이메일 입니다.');
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_EMAIL));
      }
      const user = await userService.signup(email, password, passwordConfirm, userName);
     
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGN_UP_SUCCESS, {
        email: user.email,
        userName: user.userName,
      }));
    } catch (error) {
      console.error(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.SIGN_UP_FAIL));
    }
  },

  signin: async (req, res) => {
    const {email, password} = req.body; 
  
     if(!email || !password) {
      console.log('필요한 값이 없습니다!');
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
     }
     
    try{
      const alreadyEmail = await userService.emailCheck(email);
      if(!alreadyEmail) {
        console.log('없는 이메일 입니다.');
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_EMAIL));
      }
      
      const { salt, password: hashedPassword } = alreadyEmail;
      const user = await userService.signin(email,password, salt);

      if(!user){
        console.log('비밀번호가 일치하지 않습니다.');
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
      }
      
      const { accessToken, refreshToken } = await jwt.sign(user);
      const mostRecentDate = await KeywordByDate.findAll({
        limit: 1,
        attributes: ['date'],
        where: {
            date: {
                [Op.lt]: new Date(),
            }
        },
        order : [['date', 'DESC']],
        include: [{
            model: TotalKeyword,
            attributes: ['UserId'],
            where: { UserId: user.id }
        }]
      }); 
      let keywordsExist = false;
      if(mostRecentDate.length){
        keywordsExist = true;
      }
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
        "userName": user.userName,
        "email": user.email,
        "keywordsExist": keywordsExist,
        accessToken,
        refreshToken
      }));
    } catch (error) {
      console.error(error);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.SIGN_IN_FAIL));
    }
  },

  deleteOne: async (req, res) => {
    const { id } = req.decoded;
    // const id = 2;
    const { password } = req.body;
    const isCorrect = await userService.checkPassword(id, password);

    if (!isCorrect) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
    }
    const result = await User.destroy({
      where: {
        id: id,
      }
    });
    if (!result) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK,'회원 탈퇴 성공'));
  },
  readPassword: async (req, res) => {
    const { id } = req.decoded;
    const { password } = req.body;
    const isCorrect = await userService.checkPassword(id, password);
    
    if (!password) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    
    const result = {};
    result.isCorrect = isCorrect;
    console.log(result);
    if(!isCorrect) {
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.MISS_MATCH_PW, result));
    }
    
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '비밀번호가 일치합니다', result));
  },
  updatePassword: async (req, res) => {
    const { id } = req.decoded;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    
    const isCorrect = await userService.checkPassword(id, password);

    if(!isCorrect) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.MISS_MATCH_PW));
    }

    const salt = crypto.randomBytes(64).toString('base64');
    const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 10000, 64, 'sha512').toString('base64');
    const result = await User.update({
      password: hashedPassword,
      salt: salt,
    }, {
      where: {
        id: id,
      }
    });
    if (!result) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '비밀번호 변경 성공'));
  },
  updateNickname: async (req, res) => {
    const { id } = req.decoded;
    const { nickname } = req.body;
    if (!nickname) {
      console.log('필요한 값이 없습니다');
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      await User.update({ userName: nickname }, {
        where: {
          id: id
        }
      });
      const newUser = await User.findOne({
        attributes: ['userName'],
        where: {
          id: id,
        }
      })
      const newName = newUser.userName;
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, '닉네임 변경 성공', { newName: newName }));
    } catch (err) {
      console.log(err);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
    
  }
}