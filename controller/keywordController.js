const { User, Keyword, TotalKeyword, KeywordByDate, WeekGoal } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { formatters } = require('debug');
const keyword = require('../models/keyword');
const { Op } = require('sequelize');
const responseMessage = require('../modules/responseMessage');

module.exports = {
  /* 키워드 선택 */
  selectKeywords: async (req, res) => {
    // const id = 2;
    const { id } = req.decoded;
    const { keywords } = req.body; // "keywords": ["단어1", "단어2","단어3"]
    const keywordsByDate = []
    if (!keywords) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    else if (!keywords.length) {
      console.log('선택된 키워드가 없습니다');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, '선택된 키워드가 없습니다'));
    }
    try {
      for(var name of keywords) {
        const keyword = await Keyword.findOrCreate({
          raw: true,
          where: { name : name },
          defaults: {
            name: name
          } 
        });
        const totalKeyword = await TotalKeyword.findOrCreate({
          raw: true,
          where: {
            KeywordId: keyword[0].id,
            UserId: id
          },
          defaults: {
            KeywordId: keyword[0].id,
            UserId: id
          }
        })
        const keywordByDate = await KeywordByDate.create({
          TotalKeywordId: totalKeyword[0].id,
          date: new Date()
        })
        // const weekGoal = await WeekGoal.create({
        //   TotalKeywordId: totalKeyword.id,
        //   date: keywordByDate.date
        // })
        keywordsByDate.push(keywordByDate);
      } 
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 설정 완료", keywordsByDate)); 
    } catch(err){
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 설정 실패"));
    }
  },
  /* 키워드 정의 */
  defineKeyword: async (req, res) => {
    const { id } = req.decoded;
    const { name, definition } = req.body;
    if (!name || !definition) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try{
      const keyword = await Keyword.findOne({where: {name: name}});
      const totalKeyword = await TotalKeyword.findOne({where: {UserId: id, KeywordId: keyword.id}});
      const updated = await KeywordByDate.update({
        definition: definition
      },{
        where: {TotalKeywordId: totalKeyword.id}
      });
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 정의 등록 완료"));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  readKeywordDef: async (req, res) => {
    const { id } = req.decoded;
    const { totalKeywordId } = req.query;
  },
  /* 우선순위 설정 */
  setPriorities: async (req, res) => {
    // const id = 3;
    const { id } = req.decoded;
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
  /* 키워드 추가 */
  addKeyword: async (req, res)  => {
    // const id = 3;
    const { id } = req.decoded;
    const { name } = req.body;
    if (!name) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      const keyword = await Keyword.findOrCreate({
        where: { name : name }
      });
      const totalKeyword = await TotalKeyword.findOne({
        where: {
          KeywordId: keyword[0].id,
          UserId: id
        }
      })
      if(totalKeyword){
        console.log('이미 존재하는 키워드입니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST,"이미 존재하는 키워드입니다."));
      }
      else {
        await TotalKeyword.create({
          KeywordId: keyword[0].id,
          UserId: id
        })
      }
      const result = new Object();
      result.keyword = keyword[0].name;
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 추가 완료", result));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
  deleteKeyword: async (req, res)  => {
    const { id } = req.decoded;
    // const id = 3;
    const { keywords } = req.body;
    if (!keywords) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    try {
      for (var k of keywords) {
        const keyword = await Keyword.findOne({ name : k.name });
        const totalKeyword = await TotalKeyword.destroy({
          where: {
            KeywordId: keyword.id,
            UserId: id
          }
        })
      } 
      return res.status(sc.OK).send(ut.success(sc.OK, "키워드 삭제 완료"));
    } catch(err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 추가 실패"));    
    }
  },
  readTaskKeyword: async (req, res) => {
    const { id } = req.decoded;
    //const id = 1;
    const result = {};
    try {

      let totalKeywords = await TotalKeyword.findAll({
        raw: true,
        attributes: ['id'],
        where: {
          UserId: id
        }
      });
      totalKeywordIds = totalKeywords.map(e => e.id);
      if(totalKeywords.length === 0) {
        console.log('사용자가 키워드를 정하기 전임');
        return res
          .status(sc.OK)
          .send(ut.success(sc.OK, '키워드가 없어요.'));
      }
 
      const mostRecentDate = await KeywordByDate.findOne({
        raw: true,
        attributes: ['date'],
        order: [['date', 'DESC']],
        where: {
          TotalKeywordId: {
            [Op.in]: totalKeywordIds
          }
        }
      });
      const currentSelectedKeywords = await KeywordByDate.findAll({
        raw: true,
        where: {
          date: mostRecentDate.date
        },
        order: [['priority', 'ASC']],
        include: [
          {
            model: TotalKeyword,
            where: {
              UserId: id,
            },
            include: [
              {
                model: Keyword,
                attributes: ['name']
              }
            ]
          }
        ]
      });
      const keywords = [];
      currentSelectedKeywords.forEach(o => {
        const e = {};
        e.totalKeywordId = o['TotalKeyword.id'];
        e.name = o['TotalKeyword.Keyword.name'];
        keywords.push(e);
      })
      result.keywords = keywords;
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, '마이페이지 기록키워드 조회 성공', result));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
  readKeywordList:   async (req, res) => {
    const { id } = req.decoded;
    try {
      //KeywordByDate에서 가장 최근 키워드를 뽑아온당!
      const totalKeywordObjs = await TotalKeyword.findAll({
        attributes: ['id'],
        where: {
          UserId: id,
        }
      });
      
      const totalKeywordIds = totalKeywordObjs.map(e => e.id);
      
      //그 키워드가 등록된 날짜를 가져온다: mostRecentDate
      const mostRecentDateObj = await KeywordByDate.findOne({
        attributes: ['date'],
        where: {
          TotalKeywordId: {
            [Op.in]: totalKeywordIds,
          }
        },
        order: [['date', 'DESC']]
      });
      const mostRecentDate = mostRecentDateObj.date;

      // 지금 선택되어있는 키워드의 totalKeywordId를 가져온다.
      const KeywordByDates = await KeywordByDate.findAll({
        attributes: ['TotalKeywordId'],
        where: {
          date: mostRecentDate,
        }
      });

      const selectedTotalKeywordIds = KeywordByDates.map(e => e.TotalKeywordId);
      const notSelectedTotalKeywordIds = totalKeywordIds.filter(e => !selectedTotalKeywordIds.includes(e));

      const selectedKeywords = await TotalKeyword.findAll({
        where: {
          id: {
            [Op.in]: selectedTotalKeywordIds
          }
        },
        include: [{
          model: Keyword,
          attributes: ['name']
        }]
      });
      const notSelectedKeywords = await TotalKeyword.findAll({
        where: {
          id: {
            [Op.in]: notSelectedTotalKeywordIds
          }
        },
        include: [
          {
            model: Keyword,
            attributes: ['name']
          }
        ]
      });
      const result = [];
      selectedKeywords.forEach(e => {
        const obj = {};
        obj.totalKeywordId = e.id;
        obj.isSelected = true;
        obj.name = e.Keyword.name;
        result.push(obj);
      })
      notSelectedKeywords.forEach(e => {
        const obj = {};
        obj.totalKeywordId = e.id;
        obj.isSelected = false;
        obj.name = e.Keyword.name;
        result.push(obj);
      })
      //TotalKeyword에서 사용자가 사용하는 키워드를 KeywordByDate에 있는 애들을 제외하고 가져온다!

      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, '마이페이지 키워드 리스트 조회 성공', result));
    }catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
}
