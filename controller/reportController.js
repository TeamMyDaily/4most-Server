const { User, KeywordRecord, Keyword, Task, TotalKeyword, WeekGoal} = require('../models');
const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const jwt = require('../modules/jwt');
const moment = require('moment-timezone');
const { Op } = require('sequelize');
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

module.exports = {
  // GET /reports?startYear=20
  selectWeek: async (req, res) => {
    console.log(req.query);
    const { start, end }  = req.query;
    // const start='2021-01-01', end='2021-01-03';
    // const { id } = req.decoded;
    const id = 1;
    if (!id || !start || !end) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);

    try {
      const user = await User.findOne({ where: {id: id} });
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return res
          .status(sc.BAD_REQUEST)
          .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
      }      

      const queryResult = await KeywordRecord.findAll({
        raw: true,
        limit: 4,
        attributes: { exclude: ['id'] },
        where: {
          [Op.and]: [{ date : { [Op.lte]: endDate }}, { date : { [Op.gte]: startDate }}]
        },
        order: [['date', 'DESC'],['priority','ASC']],
        include: [
          {
            model: TotalKeyword,
            where: {
              Userid: id
            },
            include: [
              {
                model: Keyword,
                attributes: ['name'],
              },
              {
                model: WeekGoal,
                attributes: ['goal'],
              },
              {
                model: Task,
                attributes: ['satisfaction']
              }
            ]
          }
        ]
      });

      // 객체 하나: 키워드 이름, 금주 목표, task 개수, 만족도 평균
      const result = [{}, {}, {}, {}];
      // priority-1 이 배열 인덱스
      
      for(let o of queryResult) {
        result[o.priority-1].keywordName = o['TotalKeyword.Keyword.name'];
        result[o.priority-1].weekGoal = o['TotalKeyword.WeekGoal.goal'];
        if( result[o.priority-1].taskCnt ) result[o.priority-1].taskCnt++;
        else result[o.priority-1].taskCnt = 1;
        if( result[o.priority-1].taskSatisAvg ){
          result[o.priority-1].taskSatisAvg += o['TotalKeyword.Tasks.satisfaction'];
        } else {
          result[o.priority-1].taskSatisAvg = o['TotalKeyword.Tasks.satisfaction'];
        }
      }
      
      console.log(result);

      result.forEach(o => {
        let avg = o.taskSatisAvg/o.taskCnt
        o.taskSatisAvg = avg.toFixed(1);
      })

      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.READ_REPORT_SUCCESS, result));
      
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }    
  },

  selectDetail: async (req, res) => {

  },
}