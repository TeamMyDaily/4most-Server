const { User, Keyword, TotalKeyword, SelectedKeyword, Task, KeywordRecord } = require('../models');
const { Op } = require("sequelize");
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');

module.exports = {
    readAll: async(req, res) => {
        try{
            const date  = '2021-01-04';
            const id = 5;
            // const { date } = req.param;
            // const { id } = req.decoded;
            const keywordRecords = await KeywordRecord.findAll({
                attributes: { exclude: ['id'] },
                where: {
                    date : {
                        [Op.lt]: new Date(date),
                    }
                },
                order: [['date', 'DESC'],['priority','ASC']],
                include: [{
                    model: TotalKeyword,
                    where: { UserId: id },
                    include: [{
                        model: Keyword,
                        attributes: ['name']
                    },{
                        model: Task,
                        attributes: ['title']
                    }]
                }],
            })
            const totalKeywords = keywordRecords.slice(0,4)
            const result = new Array();
            for (var totalKeyword of totalKeywords) {
                const data = new Object() ;
                data.priority = totalKeyword.priority;
                data.name = totalKeyword.TotalKeyword.Keyword.name;
                data.tasks = totalKeyword.TotalKeyword.Tasks
                result.push(data);
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 조회 성공", result));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR)
            .send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 조회 실패"));
        }
    },

    createTask : async (req, res) => {
        try {
            const { name, title, detail, rate, date } = req.body;
            const { id } = req.decoded;
            const keyword = await Keyword.findOne({where: { name: name }});
            const totalKeyword = await TotalKeyword.findOne({
                where: {
                    KeywordId: keyword,
                    UserId: id
                }
            });
            const task = await Task.create({
                TotalKeywordId: totalKeyword.id,
                title: title,
                detail: detail,
                rate: rate,
                date: date
            });
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 생성 성공", task));
        } catch (err) {
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR)
            .send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 생성 실패"));
        }
    }
}