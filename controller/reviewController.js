const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const { Review } = require('../models');
const { Op } = require('sequelize');
module.exports = {
  readOne: async (req, res) => {
    const { start, end } = req.query;
    const { id }  = req.decoded;
    // const id = 1;
    if (!id || !start || !end) {
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const startDate = new Date(+start);
      const endDate = new Date(+end);
      const result = {};

      const foundReview = await Review.findOne({
        attributes:['good', 'bad', 'next'],
        where: {
          UserId: id,
          date: {[Op.gte]: startDate, [Op.lt]: endDate}
        }
      });

      if (foundReview) {
        result.isWritten = true;
        result.review = foundReview;
        return res.status(sc.OK).send(ut.success(sc.OK, '주차별 회고 조회 성공', result));
      } else {
        result.isWritten = false;
        return res.status(sc.OK).send(ut.success(sc.OK, '주차별 회고 조회 성공', result));
      }
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

  },
  createOrUpdateOne: async (req, res) => {
    const { start, end, now, subType, content } = req.body;
    const { id } = req.decoded;
    
    // const id = 1;
    if (!id || !start || !end || !subType || !(typeof(content) === 'string')) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    if (subType!==1 && subType!==2 && subType!==3) {
      console.log('type값 오류');
      return res
        .status(sc.BAD_REQUEST)
        .send(util.fail(sc.BAD_REQUEST, 'subType 범위 이상'));
    }
    try {
      const startDate = new Date(+start);
      const endDate = new Date(+end);
      const nowDate = new Date(+now);
      const createEndDate = new Date(+end-1);
      const alreadyWritten = await Review.findOne({
        where: {
          UserId: id,
          date: {
            [Op.gte]: startDate,
            [Op.lt]: endDate
          }
        }
      });

      let createdReview;
      if(alreadyWritten) { // create new review
        switch(subType) {
          case 1: 
            await Review.update(
              { good: content },
              { where: { UserId: id, date: { [Op.gte]: startDate, [Op.lt]: endDate } } }
            );
            break;
          case 2:
            await Review.update(
              { bad: content },
              { where: { UserId: id, date: { [Op.gte]: startDate, [Op.lt]: endDate } } }
            );
            break;
          case 3:
            await Review.update(
              { next: content },
              { where: { UserId: id, date: { [Op.gte]: startDate, [Op.lt]: endDate } } }
            );
            break;
        }
      } else {
        let inputDate;
        if (startDate <= nowDate && nowDate < endDate){
          inputDate = nowDate
        } else {
          inputDate = createEndDate;
        }
        switch(subType) {
          case 1: 
            createdReview = await Review.create({ UserId: id, date: inputDate, good: content });
            break;
          case 2:
            createdReview = await Review.create({ UserId: id, date: inputDate, bad: content });
            break;
          case 3:
            createdReview = await Review.create({ UserId: id, date: inputDate, next: content });
            break;
        }
      }
      createdReview = await Review.findOne({
        attributes: ['good', 'bad', 'next'],
        where: {
          UserId: id,
          date: {[Op.gte]: startDate, [Op.lt]: endDate}
        }
      });
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, '회고 등록 완료', createdReview));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  }
}
