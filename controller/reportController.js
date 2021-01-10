const { User, KeywordByDate, Keyword, Task, TotalKeyword, WeekGoal} = require('../models');
const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const { Op } = require('sequelize');

module.exports = {
  // GET /reports?startYear=20
  readWeekReview: async (req, res) => {
    const { start, end }  = req.query;

    const { id } = req.decoded;
    // const id = 1; //development

    if (!id || !start || !end) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    //무조건 문자로 넘어와서 숫자로 변경 해주어야 함
    const startDate = new Date(start*1);
    const endDate = new Date(end*1);
    try {
      const user = await User.findOne({ where: {id: id} });
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return res
          .status(sc.BAD_REQUEST)
          .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
      }      

      const mostRecentDate = await KeywordByDate.findAll({
        limit: 1,
        attributes: ['date'],
        where: {
          [Op.and]: [{ date : { [Op.lte]: endDate }}, { date : { [Op.gte]: startDate }}]
        },
        order: [['date', 'DESC']]
      });
      
      //여기서 그 주차에 있었던 키워드들은 다 가지고 와야 함
      const queryResult = await KeywordByDate.findAll({
        //raw: true,
        attributes: { exclude: ['id'] },
        where: {
          date: { [Op.lte]: mostRecentDate[0].date }
        },
        order: [['date','DESC'],['priority','ASC']],
        include: [
          {
            model: TotalKeyword,
            where: {
              UserId: id
            },
            include: [
              {
                model: Keyword,
                attributes: ['name'],
              },
              {
                model: WeekGoal,
                limit: 1,
                order: [['date', 'DESC']],
                attributes: ['goal'],
                where: {
                  [Op.and] : [{ 
                    date: { [Op.gte]: startDate },
                    date: { [Op.lte]: endDate }
                  }]
                }
              },
              {
                model: Task,
                attributes: ['satisfaction'],
                where: {
                  [Op.and] : [{ 
                    date: { [Op.gte]: startDate},
                    date: { [Op.lte]: endDate }
                  }]
                }
              }
            ]
          }
        ]
      });

      const data = new Object();
      for (let o of queryResult){
        if (o.TotalKeyword.Tasks.length) {
          const name= o.TotalKeyword.Keyword.name;
          //같은 키워드라도 한 주 중간에 키워드 바뀐 경우 KeywordByDate객체가 달라서 따로 출력된다. 이를 막기 위해 조건문 이용
          if(name in data) { 
            if(o.TotalKeyword.WeekGoals.length){
              data[name].weekGoal = o.TotalKeyword.WeekGoals[0].goal;
            }
            else{
              data[name].weekGoal = undefined
            }
            let sum = data[name].taskSatisAvg*data[name].taskCnt;
            for (let task of o.TotalKeyword.Tasks) {
              sum+=task.satisfaction;
            }
            data[name].taskCnt += o.TotalKeyword.Tasks.length;
            data[name].taskSatisAvg = (sum/data[name].taskCnt).toFixed(1);
          }
          else {
            data[name] = new Object();
            if(o.TotalKeyword.WeekGoals.length){
              data[name].weekGoal = o.TotalKeyword.WeekGoals[0].goal;
            }
            data[name].taskCnt = o.TotalKeyword.Tasks.length;
            let sum = 0;
            for (let task of o.TotalKeyword.Tasks) {
              sum+=task.satisfaction;
            }
            data[name].taskSatisAvg = (sum/data[name].taskCnt).toFixed(1);
          }
        }
      }

      // 객체 하나: 키워드 이름, 금주 목표, task 개수, 만족도 평균
      // const result = [];

      // priority -1 이 result의 인덱스가 된다. 
      // for(let o of queryResult) {
      //   if (!result[o.priority-1]) result[o.priority-1] = new Object();
      //   result[o.priority-1].totalKeywordId = o['TotalkeywordId'];
      //   result[o.priority-1].keywordName = o['TotalKeyword.Keyword.name'];
      //   result[o.priority-1].WeekGoal = o['TotalKeyword.WeekGoal.goal'];
      //   if( result[o.priority-1].taskCnt ) result[o.priority-1].taskCnt++;
      //   else result[o.priority-1].taskCnt = 1;
      //   if( result[o.priority-1].taskSatisAvg ){
      //     result[o.priority-1].taskSatisAvg += o['TotalKeyword.Tasks.satisfaction'];
      //   } else {
      //     result[o.priority-1].taskSatisAvg = o['TotalKeyword.Tasks.satisfaction'];
      //   }
      // }
      
      // result.forEach(o => {
      //   let avg = o.taskSatisAvg/o.taskCnt
      //   o.taskSatisAvg = avg.toFixed(1);
      // })

      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.READ_REPORT_SUCCESS,data));
      
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }    
  },

  readWeekReviewDetail: async (req, res) => {
    const { start, end } = req.query;
    const { totalKeywordId } = req.body;
    const { id } = req.decoded;
    // const id = 1; //development

    if (!id || !start || !end) {
      console.log('필요한 정보가 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
  
    const startDate = new Date(+start), endDate = new Date(+end);


    //한 개의 키워드에 대해서!!
    try {
      const rawKeywordName = await TotalKeyword.findOne({
        attributes: [],
        include: [{
          model: Keyword,
          attributes: ['name']
        }]
      });

      const keywordName = rawKeywordName.Keyword.name;

      const user = await User.findOne({ where: {id: id} });
      if (!user) {
        console.log('사용자를 찾을 수 없음');
        return res
          .status(sc.BAD_REQUEST)
          .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
      }
      const weekGoal = await WeekGoal.findAll({
        raw: true,
        limit: 1,
        order: [['date', 'DESC']],
        where: {
          totalKeywordId: totalKeywordId,
          date : { [Op.lte]: endDate , [Op.gte]: startDate }
        }
      });
      
      const goalStartDate = weekGoal[0].date;
      
      const totalKeywords = await TotalKeyword.findAll({
        raw: true,
        where: {
          id: totalKeywordId
        },
        include: [
          {
            model: Task,
            attributes: ['id', 'title', 'date', 'satisfaction'],
            where: {
              date: {
                [Op.gte]: goalStartDate,
              }
            }
          }
        ]
      });

      console.log()
      const result = {};
      result.keywordName = keywordName;
      result.goal = weekGoal[0]['goal'];
      result.isGoalCompleted = !!weekGoal[0]['isGoalCompleted'];
      
      result.tasks = [];
      totalKeywords.forEach(o => {
        let task = {};
        task.taskId = o['Tasks.id'];
        task.title = o['Tasks.title'];
        task.date = o['Tasks.date'];
        task.satisfaction = o['Tasks.satisfaction'];
        result.tasks.push(task);
      })
      
      return res
              .status(sc.OK)
              .send(ut.success(sc.OK, '리포트 > 키워드별 조회 성공', result));
    } catch (err) {
      console.log(err);
      return res 
              .status(sc.INTERNAL_SERVER_ERROR)
              .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
    
  },
}