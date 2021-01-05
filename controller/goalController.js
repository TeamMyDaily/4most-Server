const { User, Keyword, TotalKeyword, KeywordByDate, WeekGoal } = require('../models');
const { Op } = require("sequelize");
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');

module.exports = {
  readAll: async (req, res)  => {
    // const { id } = req.decoded;
    const id = 1;
    const { start, end }  = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    try {
      const user = await User.findOne({where: {id: id}});
      const mostRecentDate = await KeywordByDate.findAll({
        limit: 1,
        attributes: ['date'],
        where: {
            date: {
                [Op.lt]: endDate,
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
      console.log(selectedKeywords);
      const result = new Array();
            for (var selectedKeyword of selectedKeywords) {
                const data = new Object() ;
                data.totalKeywordId = selectedKeyword.TotalKeywordId;
                data.priority = selectedKeyword.priority;
                data.name = selectedKeyword.TotalKeyword.Keyword.name;
                const weekGoal = selectedKeyword.TotalKeyword.WeekGoals;
                if (weekGoal.length){
                  data.weekGoalId = weekGoal[0].id;
                  data.weekGoal = weekGoal[0].goal;
                  data.isGoalCompleted = weekGoal[0].isGoalCompleted;
                }
                result.push(data);
            }
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 조회 성공", result));
    }catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "목표 조회 실패"));
    }
  },
  addGoal: async (req, res)  => {
    try{
      const { totalKeywordId, goal } = req.body;
      const weekGoal = await WeekGoal.create({
        TotalKeywordId : totalKeywordId,
        goal: goal,
        date : new Date()
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 추가 성공", weekGoal));
    }catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "목표 추가 실패"));
    }
  },
  updateGoal: async (req, res) => {
    try{
      const { weekGoalIds } = req.body;
      for (var weekGoalId of weekGoalIds) {
        const weekGoal = await WeekGoal.findOne({where: { id: weekGoalId }});
        if (weekGoal.isGoalCompleted){
          await WeekGoal.update({
            isGoalCompleted : false
          },{
            where: { id: weekGoalId }
          })
        }
        else {
          await WeekGoal.update({
            isGoalCompleted : true
          },{
            where: { id: weekGoalId }
          })
        }                    
      }
      const weekGoals = await WeekGoal.findAll({
        where: {
          id : weekGoalIds
        }
      });
      // console.log(weekGoals)
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 달성여부 설정 완료", weekGoals));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "목표 달성여부 설정 실패"));
    }
  },
  changeGoal: async(req, res) => {
    try {
      const { weekGoalId } = req.params;
      const { goal } = req.body;
      await WeekGoal.update(
        {
          goal : goal
        },{
          where: { id: weekGoalId }
        }
      )
      const weekGoal = await WeekGoal.findOne({
        where: { id: weekGoalId }
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 수정 완료", weekGoal));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "목표 수정 실패"));
    }
  },
  deleteGoal: async(req, res) => {
    try{
      const { weekGoalId } = req.params;
      const weekGoal = await WeekGoal.destroy({
        where: { id: weekGoalId }
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "목표 삭제 완료"));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "목표 삭제 실패"));
    }
    
  }
}