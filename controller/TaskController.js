const { User, Keyword, TotalKeyword, SelectedKeyword, Task } = require('../models');
// const ut = require('../modules/util');
// const sc = require('../modules/statusCode');
// const rm = require('../modules/responseMessage');

module.exports = {
    createTask : async (req, res) => {
        const { accountId, selectedKeywordId, title, detail, rate, date } = req.body;
        try {
            const user = await User.findOne({ where: { accountId : accountId} });
            const task = await Task.create({
                SelectedKeywordId: selectedKeywordId,
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
    },
    readTask: async (req, res) => {

    }
}