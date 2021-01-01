const { User, Keyword, TotalKeyword, SelectedKeyword } = require('../models');
// const ut = require('../modules/util');
// const sc = require('../modules/statusCode');
// const rm = require('../modules/responseMessage');

module.exports = {
  createKeyword: async (req, res) => {
    const { keywords, accountId } = req.body;
    try {
        const user = await User.findOne({ where: {accountId: accountId}});
        const added = keywords.added;
        const selected = keywords.selected;
        const deleted = keywords.deleted;

        //사용자 추가한 키워드
        for (var i=0; i<added.length; i++) {
            const name = added[i];
            const keyword = await Keyword.create({ name : name });
            await TotalKeyword.create({ KeywordId: keyword.id, UserId: userId });
        };

        //사용자가 삭제한 키워드 삭제
        for (var i=0; i<deleted.length; i++) {
            const name = deleted[i];
            const keyword = await Keyword.findOne( { where: {name: name} } );
            await TotalKeyword.destroy({ where: { KeywordId: keyword.id, UserId: userId }});
            
            const totalKeywords = TotalKeyword.findAll({ where: { KeywordId: keyword.id }});
            if (!totalKeywords) {
                await Keyword.destroy({ where: { name: name }});
            }
        };

        //사용자가 선택한 키워드 추가
        const selectedKeywords = [];
        for (var i=0; i<selected.length; i++) {
            const name = selected[i];
            const keyword = await findOne({ name: name })
            const totalKeyword = await TotalKeyword.findOne({ where: { KeywordId: keyword.id }});
            const selectedKeyword = await SelectedKeyword.create({ TotalKeywordId: totalKeyword.id });
            selectedKeywords.push(selectedKeyword)
        }
        return res.status(sc.OK).send(ut.success(sc.OK, "키워드 설정 완료", selectedKeywords));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR)
      .send(ut.fail(sc.INTERNAL_SERVER_ERROR, "키워드 설정 실패"));
    }
  },
}