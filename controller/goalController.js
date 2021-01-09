const { User, Keyword, TotalKeyword, KeywordByDate, WeekGoal } = require('../models');
const { Op } = require("sequelize");
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');

module.exports = {
  /* 전체 목표 조회 */
  readAll: async (req, res)  => {
    // const { id } = req.decoded;
    const id = 1;
    const { start, end }  = req.query;
    const startDate = new Date(start*1);
    const endDate = new Date(end*1);
    if (!start || !end ) {
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const mostRecentDate = await KeywordByDate.findAll({
        limit: 1,
        attributes: ['date'],
        where: {
            date: {
                [Op.lte]: endDate,
            }
        },
        order : [['date', 'DESC']],
        include: [{
            model: TotalKeyword,
            attributes: ['UserId'],
            where: { UserId: id }
        }]
      });
      const selectedKeywords = await KeywordByDate.findAll({
        attributes: { exclude: ['id'] },
        where: {
            date : mostRecentDate[0].date
        },
        order: [['priority','ASC']],
        include: [{
            model: TotalKeyword,
            where: { UserId: id },
            include: [{
                model: Keyword,
                attributes: ['name']
            },{
                model: WeekGoal,
                limit: 1,
                where: {
                  [Op.and]: [{ date : { [Op.lte]: endDate }}, { date : { [Op.gte]: startDate }}]
                },
                order: [['date', 'DESC']],
            }]
        }],
      });
      const keywords = new Array();
      const count = selectedKeywords.length;
      let notSetGoalCount = 0;
      for (var selectedKeyword of selectedKeywords) {
        const data = new Object();
        data.totalKeywordId = selectedKeyword.TotalKeywordId;
        data.priority = selectedKeyword.priority;
        data.name = selectedKeyword.TotalKeyword.Keyword.name;
        const weekGoal = selectedKeyword.TotalKeyword.WeekGoals;
        if (weekGoal.length) {
          data.isGoalCreated = true;
          data.weekGoalId = weekGoal[0].id;
          data.weekGoal = weekGoal[0].goal;
          data.isGoalCompleted = weekGoal[0].isGoalCompleted;
        }
        else{
          notSetGoalCount += 1;
          data.isGoalCreated = false;
        }
        keywords.push(data);
      }
      const result = new Object();
      result.count = count;
      result.notSetGoalCount = notSetGoalCount;
      result.keywords = keywords;
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 조회 성공", result));
    }catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  /* 목표 추가 */
  addGoal: async (req, res)  => {
    const { startDate, totalKeywordId, goal } = req.body;
    console.log(new Date(startDate))
    if(!totalKeywordId||!goal) {
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try{
      const date = new Date(startDate);
      const weekGoal = await WeekGoal.create({
        TotalKeywordId : totalKeywordId,
        goal: goal,
        date : date
      })
      console.log(weekGoal);
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 추가 성공", weekGoal));
    }catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  /* 목표 달성여부 설정(완료->미완료, 미완료->완료) */
  updateGoal: async (req, res) => {
    const { weekGoalId }  = req.params;
    if(!weekGoalId) {
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try{
      const weekGoal = await WeekGoal.findOne({where: { id: weekGoalId }})
      const result = await WeekGoal.update({
        isGoalCompleted: Math.abs(weekGoal.isGoalCompleted-1)
      },{
        where: {id: weekGoalId}
      });
      if (!result){
        return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "목표 달성여부 설정 실패"));
      };
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 달성여부 설정 완료"));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  /* 목표 변경 */
  changeGoal: async(req, res) => {
    const { weekGoalId } = req.params;
    const { goal } = req.body;
    if(!weekGoalId || !goal ){
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      result = await WeekGoal.update(
        {
          goal : goal,
          date : new Date() //수정시간으로 날짜 업데이트
        },{
          where: { id: weekGoalId }
        }
      )
      if(!result) {
        return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "목표 수정 실패"));
      }
      const weekGoal = await WeekGoal.findOne({
        where: { id: weekGoalId }
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 수정 완료", weekGoal));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  /* 목표 삭제 */
  deleteGoal: async(req, res) => {
    const { weekGoalId } = req.params;
    if (!weekGoalId){
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try{
      const weekGoal = await WeekGoal.destroy({
        where: { id: weekGoalId }
      })
      if(!weekGoal){
        return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "목표 삭제 실패"));
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 삭제 완료"));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
    
  }
}