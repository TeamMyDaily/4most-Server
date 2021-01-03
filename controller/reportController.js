const { User, SelectedKeywords, Keyword, Task, TotalKeyword, WeekGoal } = require('../models');
const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const jwt = require('../modules/jwt');
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

module.exports = {
  // GET /reports?year=2020&month=12&weekNum=3
  selectWeek: async (req, res) => {
    const { year, month, weekNum } = req.param;
    // const { id } = req.decoded;
    const id = 1;
    if (!id) {
      console.log('사용자를 찾을 수 없음');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NO_USER));
    }
    if (!year || !month || !weekNum) {
      console.log('필요한 값이 없습니다.');
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    const selectedMonth = new Date(year, month-1);
    const selectedMonthLimit = new Date(year, month);

    try {

      /**
       * TotalKeyword: priority
       * Keyword(TotalKeyword): name
       * WeekGoal(TotalKeyword): goal
       * Task(TotalKeyword): task 개수, rate
       */
      
      //얘는 배열 안에 객체 여러 개가 있음

      // userId로 totalKeyword에서 keywordId를 가져와서 keyword
      const totalKeywordResult = await TotalKeyword.findAll({
        where: {
          userId: id
        },
        attributes: [['id', 'TotalKeywordId'], 'KeywordId', 'priority'],
        include: [
          {
            model: Keyword,
            attribues: ['name']
          },
          {
            model: WeekGoal,
            attributes: ['goal']
          },
          { // group count? 아니면 따로 세서 넣어줘야함
            model: Task,
            attributes: ['title', 'rate']
          }
        ]
      });
      // 뽑아온 키워드아이디를 계속 쓸거니까 따로 저장함
      
      
    } catch (err) {

    }    
  },

  selectDetail: async (req, res) => {

  },
}