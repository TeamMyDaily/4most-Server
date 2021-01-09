const { User, Keyword, TotalKeyword, KeywordByDate, WeekGoal } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');
const keyword = require('../models/keyword');

module.exports = {
  /* 키워드 선택 */
  selectKeywords: async (req, res) => {
    const id = 2;
    //const { id } = req.decoded;
    const { keywords } = req.body; // "keywords": ["단어1", "단어2","단어3"]
    const keywordsByDate = []
    if (!keywords) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    else if (!keywords.length) {
      console.log('선택된 키워드가 없습니다');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, '선택된 키워드가 없습니다'));
    }
    try {
      for(var name of keywords) {
        const keyword = await Keyword.findOrCreate({
          raw: true,
          where: { name : name },
          defaults: {
            name: name
          } 
        });
        console.log(keyword);
        const totalKeyword = await TotalKeyword.create({
          KeywordId: keyword[0].id,
          UserId: id
        })
        const keywordByDate = await KeywordByDate.create({
          TotalKeywordId: totalKeyword.id,
        })
        const weekGoal = await WeekGoal.create({
          TotalKeywordId: totalKeyword.id,
          date: keywordByDate.date
        })
        keywordsByDate.push(keywordByDate);
      } 
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 설정 완료", keywordsByDate)); 
    } catch(err){
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 설정 실패"));
    }
  },
  /* 키워드 정의 */
  defineKeywords: async (req, res) => {
    //const { id } = req.decoded;
    const id = 3;
    const { keywords } = req.body;
    const result = new Array();
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.findOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const updated = await KeywordByDate.update({
          definition: k.definition,
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        result.push(updated);
      };
      // if(!result.every( function( x ) { return x = true } ) ){
      //   return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "키워드 정의 실패"));
      // }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 정의 등록 완료"));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 정의 실패"));
    }
  },
  /* 우선순위 설정 */
  setPriorities: async (req, res) => {
    const id = 3;
    // const { id } = req.decoded;
    const { keywords } = req.body;
    const result = new Array();
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.findOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const updated = await KeywordByDate.update({
          priority: k.priority
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        if (updated==1) {
          const updatedKeyword = await KeywordByDate.findOne({
            where: {TotalKeywordId: totalKeyword.id}
          });
          result.push(updatedKeyword);
        }
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 우선순위 등록 완료", result));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 우선순위 등록 실패"));
    }
  },
  /* 키워드 추가 */
  addKeyword: async (req, res)  => {
    const id = 3;
    // const { id } = req.decoded;
    const { name } = req.body;
    if (!name) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const keyword = await Keyword.findOrCreate({
        where: { name : name }
      });
      const totalKeyword = await TotalKeyword.findOne({
        where: {
          KeywordId: keyword[0].id,
          UserId: id
        }
      })
      if(totalKeyword){
        console.log('이미 존재하는 키워드입니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST,"이미 존재하는 키워드입니다."));
      }
      else {
        await TotalKeyword.create({
          KeywordId: keyword[0].id,
          UserId: id
        })
      }
      const result = new Object();
      result.keyword = keyword[0].name;
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 추가 완료", result));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
  deleteKeyword: async (req, res)  => {
    // const { id } = req.decoded;
    const id = 3;
    const { keywords } = req.body;
    if (!keywords) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      for (var k of keywords) {
        const keyword = await Keyword.findOne({ name : k.name });
        const totalKeyword = await TotalKeyword.destroy({
          where: {
            KeywordId: keyword.id,
            UserId: id
          }
        })
      } 
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 삭제 완료"));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
}