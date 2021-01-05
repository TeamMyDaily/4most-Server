const { User, Keyword, TotalKeyword, KeywordByDate, Task } = require('../models');
const { Op } = require("sequelize");
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');

module.exports = {
    readAll: async(req, res) => {
        try{
            const date  = '2021-01-04';
            const id = 1;
            // const { date } = req.params;
            // const { id } = req.decoded;
            const mostRecentDate = await KeywordByDate.findAll({
                limit: 1,
                attributes: ['date'],
                where: {
                    date: {
                        [Op.lt]: new Date(date),
                    }
                },
                order : [['date', 'DESC']],
                include: [{
                    model: TotalKeyword,
                    attributes: ['UserId'],
                    where: { UserId: id }
                }]
            })
            const selectedKeywords = await KeywordByDate.findAll({
                attributes: { exclude: ['id'] },
                where: {
                    date : mostRecentDate[0].date
                },
                order: [['priority','ASC']],
                include: [{
                    model: TotalKeyword,
                    where: { UserId: id },
                    include: [{
                        model: Keyword,
                        attributes: ['name']
                    },{
                        model: Task,
                        attributes: ['title', 'satisfaction']
                    }]
                }],
            })
            const result = new Array();
            for (var selectedKeyword of selectedKeywords) {
                const data = new Object() ;
                data.priority = selectedKeyword.priority;
                data.name = selectedKeyword.TotalKeyword.Keyword.name;
                data.tasks = selectedKeyword.TotalKeyword.Tasks;
                result.push(data);
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 전체 조회 성공", result));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 전체 조회 실패"));
        }
    },
    readTask: async (req, res) => {
        try{
            const { taskId } = req.params;
            const task = await Task.findOne({
                where: { id: taskId }
            });
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 조회 성공", task));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 조회 실패"));
        } 
        


    },
    createTask : async (req, res) => {
        try {
            const { keyword, title, detail, satisfaction, date } = req.body;
            const id = 1;
            // const { id } = req.decoded;
            // const name = await Keyword.findOne({where: { name: name }});
            const totalKeyword = await TotalKeyword.findOne({
                where: {
                    UserId: id
                },
                include: [{
                    model: Keyword,
                    where: { name: keyword },
                }]
            });
            const task = await Task.create({
                TotalKeywordId: totalKeyword.id,
                title: title,
                detail: detail,
                satisfaction: satisfaction,
                date: new Date(date)
            });
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 생성 성공", task));
        } catch (err) {
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 생성 실패"));
        }
    }
}