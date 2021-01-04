const { User, Keyword, TotalKeyword, SelectedKeyword, KeywordRecord } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');
const keyword = require('../models/keyword');

module.exports = {
  /* 사용자별 전체 키워드 불러오기 */
  readAll: async (req, res) => {
    const { id } = req.decoded;
    try {
      const user = await User.findOne({ where : { id }, attributes: ['id']});
      /* 사용자가 추가한 키워드만 조회 */
      const totalKeywords = await TotalKeywords.findAll({
        where: { 
          UserId: user.id,
          isCustom: true 
        },
        attributes: ['KeywordId']
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 조회 완료", totalKeywords));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 조회 실패"));    
    }
  },
  /* 사용자별 키워드 추가 */
  addKeyword: async (req, res)  => {
    const { id } = req.decoded;
    const { keywords } = req.body;
    try {
      addedKeyword = new Array();
      for ( var keyword of keywords) {
        const keyword = await Keyword.create({ name : name });
        const totalKeyword = await TotalKeyword.create({
          KeywordId: keyword.id,
          UserId: id
        })
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 추가 완료", { keyword: keyword.name }));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
  /* 사용자별 생성 키워드 삭제 */
  deleteKeyword: async (req, res) => {
    const { id } = req.decoded;
    const { name } = req.body;
    try {
      const keyword = await Keyword.findOne({ where: { name : name }, attributes: ['id'] });
      const totalKeyword = await TotalKeyword.destroy({
         where: {
           UserId: id, KeywordId: keyword.id
          }
      })
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 삭제 완료", totalKeyword));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 삭제 실패"));    
    }
  },
  /* 선택한 키워드 등록 */
  selectKeyword: async (req, res) => {
    const { id } = req.decoded;
    const { selected, weekNum } = req.body;
    console.log(selected);
    const selectedKeywords = []
    try {
      for(var name of selected) {
        const keyword = await Keyword.findOne({ where: { name : name }, attributes: ['id'] })
        const totalKeyword = await TotalKeyword.findOne({
          where: {
            KeywordId: keyword.id,
            UserId: id
          }
        })
        const selectedKeyword = await SelectedKeyword.create({
          TotalKeywordId: totalKeyword.id,
          weekNum: weekNum
        })
        selectedKeywords.push(selectedKeyword);
      } 
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 설정 완료", selectedKeywords)); 
    } catch(err){
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 설정 실패"));
    }
  },
  /* 키워드 정의 등록 */
  defineKeywords: async (req, res) => {
    const { id } = req.decoded;
    const { keywords } = req.body;
    const selectedKeywords = new Array();
    const date = new Date()
    try{
      for (var k of keywords) {
        const name = k.name;
        const keyword = await Keyword.fineOne({where: {name: name}});
        const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
        const selectedKeyword = await SelectedKeyword.update({
          definition: k.definition
        },{
          where: {TotalKeywordId: totalKeyword.id}
        });
        const keywordRecord = await KeywordRecord.create({
          TotalKeywordId: totalKeyword.id,
          priority: k.priority,
          date: date
        })
        selectedKeywords.push(selectedKeyword)
      }
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 설정 완료", selectedKeyword));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 정의 실패"));
    }
  }
}