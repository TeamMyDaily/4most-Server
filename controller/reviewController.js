const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const { User, Review } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  readOne: async (req, res) => {
    const { start, end } = req.query;
    // const userId = req.decoded;
    const userId = 1;
    if (!userId || !start || !end) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const user = await User.findOne({ where: {id: userId} });
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return res
          .status(sc.BAD_REQUEST)
          .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
      }

      const startDate = new Date(start);
      const endDate = new Date(end);
      const result = {};
      const review = await Review.findOne({
        raw: true,
        where: {
          UserId: userId,
          date: {[Op.gte]: startDate, [Op.lte]: endDate}
        }
      });
      if (!review) {
        result.isWritten = false;
        return res
                .status(sc.OK)
                .send(ut.success(sc.OK, '주차별 리뷰 조회 성공', result));
      }
      result.isWritten = true;
      result.review = review;

      return res
              .status(sc.OK)
              .send(ut.success(sc.OK, '주차별 리뷰 조회 성공', result));
    } catch (err) {
      console.log(err);
      return res
              .status(sc.INTERNAL_SERVER_ERROR)
              .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

  },
  createOne: async (req, res) => {
    const { start, end, now, good, bad, next } = req.body;
    // const { id } = req.decoded;
    console.log(req.body);
    const id = 1;
    if (!id || !start || !end) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const user = await User.findOne({ where: {id: id} });
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return res
          .status(sc.BAD_REQUEST)
          .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
      }
      const startDate = new Date(start);
      const endDate = new Date(end);
      const nowDate = new Date(now);

      let inputDate;
      //이렇게 해도 괜찮은걸까
      if (startDate <= nowDate && nowDate <= endDate){
        inputDate = nowDate
      } else {
        inputDate = endDate
      }
      const createdReview = await Review.create({ UserId: id, date: inputDate, good: good, bad: bad, next: next });
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