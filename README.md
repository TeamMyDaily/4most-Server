# 🧡 4most 🧡

<img src="https://raw.githubusercontent.com/TeamMyDaily/4most-Server/226808c46742fcaa8373b3aef037d424e40bea61/public/img/wiki/appstore_ios_1024.svg" width="40%">

> *기록은 더 쉽게*
>
> *회고는 더 깊게*
>
> ***어제보다 나은 하루의 시작, 4most***



---

### Flow Chart 🧾

<img src="https://github.com/TeamMyDaily/4most-Android/raw/develop/wiki/image/210104_flowchart.png">



### Dependencies module 🔨

```json
{
  "name": "mydaily-server",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "moment-timezone": "^0.5.32",
    "morgan": "~1.9.1",
    "mysql2": "^2.2.5",
    "nodemailer": "^6.4.17",
    "nodemon": "^2.0.6",
    "sequelize": "^6.3.5",
    "sequelize-cli": "^6.2.0",
    "weeknumber": "^1.1.2"
  }
}

```



### WIKI

4most WIKI 👉🏻 [WIKI](https://github.com/TeamMyDaily/4most-Server/wiki)

### ER Diagram 

<img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d2a5e184-37bc-41a0-90e9-9fb8f9cb325a/erd9th.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210114%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210114T083357Z&X-Amz-Expires=86400&X-Amz-Signature=856488636e1c89f6e11e42fdaf411692dac9e6482da47c0b459af49b9daf2e1f&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22erd9th.png%22" width="70%">

### Model association 🤸🏻‍♀️

```javascript
/** N : M   User: Keyword */
db.User.belongsToMany(db.Keyword, { through: 'TotalKeyword' });
db.Keyword.belongsToMany(db.User, { through: 'TotalKeyword' });

/** 1 : N TotalKeyword : KeywordByDate */
db.TotalKeyword.hasMany(db.KeywordByDate, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade' });
db.KeywordByDate.belongsTo(db.TotalKeyword);

/** 1 : N   Keyword : TotalKeyword */
db.Keyword.hasMany(db.TotalKeyword, { foreignKey: { name: 'KeywordId', allowNull: false }, onDelete: 'cascade '});
db.TotalKeyword.belongsTo(db.Keyword);

/** 1 : N   User : Review */
db.User.hasMany(db.Review, { foreignKey: { name: 'UserId', allowNull: false }, onDelete: 'cascade'});
db.Review.belongsTo(db.User);

/** 1 : N   TotalKeyword : Task */
db.TotalKeyword.hasMany(db.Task, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade'});
db.Task.belongsTo(db.TotalKeyword);

/** 1 : N  TotalKeyword : WeekGoal */
db.TotalKeyword.hasMany(db.WeekGoal, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade'});
db.WeekGoal.belongsTo(db.TotalKeyword);
```


---

### 4most 핵심 기능 🏃🏻‍♂️

- **키워드 설정** : 사용자는 각자 최대 4개의 키워드를 설정할 수 있습니다. 이후에 변경/수정이 가능합니다.

- **키워드별 목표 설정**: 설정한 키워드 별로 금주의 목표를 설정할 수 있습니다.

- **하루 기록**: 설정한 목표를 달성하기 위해, 하루동안 했던 일을 기록할 수 있습니다.

- **리포트 및 회고**: 금주의 목표와 지금까지 해온 기록들을 한 눈에 확인할 수 있습니다.

- 회원가입, 마이페이지

---

### Architecture

<img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/%EC%84%9C%EB%B2%84%20%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png?raw=true" width="">

### Contributor 👩‍👧

| 최예진💛                                                 | 윤가영💚                     |
| ------------------------------------------------------- | --------------------------- |
| [Yejin6911](https://github.com/Yejin6911)               | [kyY00n](github.com/kyY00n) |
| 키워드 관련 API, 나의 기록 관련 API, 회원가입, 목표설정 | 회고 API, 마이페이지        |

### 
