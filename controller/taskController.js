const { User, Keyword, TotalKeyword, KeywordByDate, Task } = require('../models');
const { Op } = require("sequelize");
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');

module.exports = {
    /* 전체 기록 조회 */
    readAll: async(req, res) => {
        try{
            const { id } = req.decoded;
            const { date } = req.query; //date형식 밀리세컨드
            const now = new Date(date*1);
            const startTime = new Date(new Date(date*1).setHours(0,0,0));
            const mostRecentDate = await KeywordByDate.findAll({
                limit: 1,
                attributes: ['date'],
                where: {
                    date: {
                        [Op.lte]: now
                    }
                },
                order : [['date', 'DESC']],
                include: [{
                    model: TotalKeyword,
                    attributes: ['UserId'],
                    where: { UserId: id }
                }]
            })
            if(!mostRecentDate.length){
                const result = {"keywordsExist" : false}
                return res.status(sc.OK).send(ut.success(sc.OK, "설정된 키워드 없음", result))
            }
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
                    }]
                }],
            })         
            const result = new Array();
            for(var selectedKeyword of selectedKeywords) {
                const data = new Object() ;
                data.TotalKeywordId = selectedKeyword.TotalKeyword.id;
                data.priority = selectedKeyword.priority;
                data.name = selectedKeyword.TotalKeyword.Keyword.name;
                const totalKeyword = await TotalKeyword.findOne({
                    where: {
                        id: selectedKeyword.TotalKeyword.id
                    }
                })
                const Tasks = await Task.findAll({
                    where: {
                        TotalKeywordId: totalKeyword.id,
                        //해당 날짜 기준 그 다음날보다는 작고 mostRecentDate의 date보다는 크거나 같은 날에 작성된 기록이어야 한다.
                        //하루는 86400초
                        date: { [Op.and]: { [Op.lte]: now, [Op.gte]: startTime }}
                    },
                    attributes: ['id', 'title'],
                })
                data.tasks = Tasks
                result.push(data);
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 전체 조회 성공", {"keywordsExist": true, "result" : result}));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 전체 조회 실패"));
        }
    },
    /* 기록 생성. 날짜 클라한테서 받지 않음!!!! 작성하는 시간으로 저장 */
    createTask : async (req, res) => {
        const { totalKeywordId, title, detail, satisfaction } = req.body;
        // const id = 1;
        const { id } = req.decoded;
        // const name = await Keyword.findOne({where: { name: name }});
        if (!totalKeywordId|| !title || !detail || !satisfaction ){
            console.log('필요한 값이 없습니다!');
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
        try {
            const task = await Task.create({
                TotalKeywordId: totalKeywordId,
                title: title,
                detail: detail,
                satisfaction: satisfaction,
                date: new Date()
            });
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 생성 성공", task));
        } catch (err) {
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 생성 실패"));
        }
    },
    /* 특정 기록 조회 */
    readTask: async (req, res) => {
        try{
            const { taskId } = req.params;
            if (!taskId) {
                console.log('필요한 값이 없습니다!');
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
            }
            const task = await Task.findOne({
                where: { id: taskId }
            });
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 조회 성공", task));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 조회 실패"));
        } 
    },
    /* 특정 기록 수정 */
    updateTask: async (req, res) => {
        try{
            const { taskId } = req.params;
            const { title, detail, satisfaction } = req.body;
            if (!taskId){
                console.log('필요한 값이 없습니다!');
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
            }
            const task = await Task.update({
                title: title,
                detail: detail,
                satisfaction: satisfaction
            },{
                where: {id: taskId}
            });
            if (!task) {
                return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "테스크 수정 실패"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 수정 성공"));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 수정 실패"));
        } 
    },
    /* 특정 기록 삭제 */
    deleteTask: async (req, res) => {
        try{
            const { taskId } = req.params;
            if (!taskId) {
                console.log('필요한 값이 없습니다!');
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
            }
            const task = await Task.destroy({
                where: { id: taskId }
            });
            if (!task) {
                return res.status(sc.NOT_MODIFIED).send(ut.fail(sc.NOT_MODIFIED, "테스크 수정 실패"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "테스크 삭제 성공"));
        }catch (err){
            console.log(err);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, "테스크 삭제 실패"));
        } 
    }
}