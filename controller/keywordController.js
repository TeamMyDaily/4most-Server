const { User, Keyword, TotalKeyword, KeywordByDate, WeekGoal } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');
const keyword = require('../models/keyword');

module.exports = {
  selectKeywords: async (req, res) => {
    const id = 3;
    //const { id } = req.decoded;
    const { keywords } = req.body; // "kewords": ["단어1", "단어2","단어3"]
    const keywordsByDate = []
    try {
      for(var name of keywords) {
        const keyword = await Keyword.findOrCreate({
          raw: true,
          where: { name : name },
          defaults: {
            name: name
          } 
        });
        console.log(keyword);
        const totalKeyword = await TotalKeyword.create({
          KeywordId: keyword[0].id,
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
    //const { id } = req.decoded;
    const id = 3;
    const { keywords } = req.body;
    const result = new Array();
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.findOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const updated = await KeywordByDate.update({
          definition: k.definition,
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        if (updated==1) {
          const updatedKeyword = await KeywordByDate.findOne({
            where: {TotalKeywordId: totalKeyword.id}
          });
          result.push(updatedKeyword);
        };
      };
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 정의 등록 완료", result));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 정의 실패"));
    }
  },

  setPriorities: async (req, res) => {
    const id = 3;
    // const { id } = req.decoded;
    const { keywords } = req.body;
    const result = new Array();
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.findOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const updated = await KeywordByDate.update({
          priority: k.priority
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        if (updated==1) {
          const updatedKeyword = await KeywordByDate.findOne({
            where: {TotalKeywordId: totalKeyword.id}
          });
          result.push(updatedKeyword);
        }
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 우선순위 등록 완료", result));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 우선순위 등록 실패"));
    }
  },
  addKeyword: async (req, res)  => {
    const { id } = req.decoded;
    const { name } = req.body;
    try {
      const keyword = await Keyword.findOrCreate({ name : name });
      const totalKeyword = await TotalKeyword.create({
          KeywordId: keyword.id,
          UserId: id
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 추가 완료", { keyword: keyword.name }));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
}