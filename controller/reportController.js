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

      const data = new Object();

      const mostRecentDate = await KeywordByDate.findAll({
        limit: 1,
        attributes: ['date'],
        where: {
           date : { [Op.lt]: endDate, [Op.gte]: startDate }
        },
        order: [['date', 'DESC']]
      });

      if(!mostRecentDate[0]) {
        data.keywordsExist = false;
        return res
          .status(sc.OK)
          .send(ut.success(sc.OK, rm.READ_REPORT_SUCCESS, data));
      }
      
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
                    date: { [Op.lt]: endDate }
                  }]
                }
              },
              {
                model: Task,
                attributes: ['satisfaction'],
                where: {
                  [Op.and] : [{ 
                    date: { [Op.gte]: startDate},
                    date: { [Op.lt]: endDate }
                  }]
                }
              }
            ]
          }
        ]
      });
      // console.log(queryResult);
      const results = {};
      for (let o of queryResult){
        if (o.TotalKeyword.Tasks.length) {
          //const tempnew Object();
          const name= o.TotalKeyword.Keyword.name;
          //같은 키워드라도 한 주 중간에 키워드 바뀐 경우 KeywordByDate객체가 달라서 따로 출력된다. 이를 막기 위해 조건문 이용
          if(name in results) {
            if(o.TotalKeyword.WeekGoals.length){
              results[name].weekGoal = o.TotalKeyword.WeekGoals[0].goal;
            }
            else{
              results[name].weekGoal = undefined
            }
            let sum = results[name].taskSatisAvg*results[name].taskCnt;
            for (let task of o.TotalKeyword.Tasks) {
              sum+=task.satisfaction;
            }
            results[name].taskCnt += o.TotalKeyword.Tasks.length;
            results[name].taskSatisAvg = (sum/results[name].taskCnt).toFixed(1);
          }
          else {
            results[name] = new Object();
            results[name].totalKeywordId = o.TotalKeyword.id;
            results[name].keyword = name;
            if(o.TotalKeyword.WeekGoals.length){
              results[name].weekGoal = o.TotalKeyword.WeekGoals[0].goal;
            }
            results[name].taskCnt = o.TotalKeyword.Tasks.length;
            let sum = 0;
            for (let task of o.TotalKeyword.Tasks) {
              sum+=task.satisfaction;
            }
            results[name].taskSatisAvg = (sum/results[name].taskCnt).toFixed(1);
          }
        }
      }
      data.keywordsExist = true;
      //결과 배열로 변환해서 response에 넣어주기 위해 한 번 더 반복문 실행
      data.result = new Array();
      for (let keyword of Object.keys(results)) {
        data.result.push(results[keyword]);
      }
      console.log(data);
      return res.status(sc.OK).send(ut.success(sc.OK, rm.READ_REPORT_SUCCESS, data));
      
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }    
  },

  readWeekReviewDetail: async (req, res) => {
    const { start, end, totalKeywordId } = req.body;
    const { id } = req.decoded;
    // const id = 1; //development

    if (!id || !start || !end) {
      console.log(id, start, end);
      console.log('필요한 정보가 없습니다.');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
  
    const startDate = new Date(+start), endDate = new Date(+end);


    //한 개의 키워드에 대해서!!
    try {
      const rawKeywordName = await TotalKeyword.findOne({
        attributes: [],
        include: [{
          model: Keyword,
          attributes: ['name']
        }],
        where: {
          id: totalKeywordId,
        }
      });

      const keywordName = rawKeywordName.Keyword.name;

      
      const weekGoal = await WeekGoal.findAll({
        raw: true,
        limit: 1,
        order: [['date', 'DESC']],
        where: {
          totalKeywordId: totalKeywordId,
          date : { [Op.lt]: endDate , [Op.gte]: startDate }
        }
      });
      
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
                [Op.gte]: startDate, [Op.lt]: endDate,
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
      
      return res.status(sc.OK).send(ut.success(sc.OK, '리포트 > 키워드별 조회 성공', result));
    } catch (err) {
      console.log(err);
      return res .status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
    
  },
}