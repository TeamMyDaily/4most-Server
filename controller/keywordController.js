const { User, Keyword, TotalKeyword, KeywordByDate, KeywordRecord, WeekGoal } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');
const keyword = require('../models/keyword');

module.exports = {
  selectKeyword: async (req, res) => {
    const { id } = req.decoded;
    const { selectedKeywords } = req.body;
    const keywordsByDate = []
    try {
      for(var name of selectedKeywords) {
        const keyword = await Keyword.findOrCreate({
          where: { name : name },
          defaults: {
            name: name
          } 
        });
        const totalKeyword = await TotalKeyword.create({
          KeywordId: keyword.id,
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
  /* 키워드 정의 및 우선순위 등록 */
  defineKeywords: async (req, res) => {
    const { id } = req.decoded;
    const { keywords } = req.body;
    const keywordsByDate = new Array();
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.fineOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const keywordByDate = await KeywordByDate.update({
          definition: k.definition,
          priority: k.priority
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        keywordsByDate.push(keywordByDate)
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 정의 및 우선순위 등록 완료", keywordsByDate));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 정의 실패"));
    }
  }
}