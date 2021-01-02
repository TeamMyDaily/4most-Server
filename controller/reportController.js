const { User, SelectedKeywords, Keyword, Task } = require('../models');
const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');

module.exports = {
  selectWeek: async (req, res) => {
    try {
      // req.body: 년, 월, 주차, 유저메일
      const { year, month, weekNum } = req.body.selectedWeek;
      const userAccount = req.body.userAccount;

      // res.body: 해당 주간의 키워드, task 개수, task average rate(계산하기)
      switch (month) {
        case 1:

        case 12:
        
        default:
      }
      const selectedMonth = new Date(year, month-1);
      const selectedMonthLimit = new Date(year, month);
    } catch (err) {

    }
  },
  selectKeyword: async (req, res) => {

  },
}