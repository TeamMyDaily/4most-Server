# 🧡 4most 🧡

<img src="https://user-images.githubusercontent.com/55099365/103762567-d8887680-505b-11eb-9a76-83b8da83104c.jpeg" width="50%">

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

<img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c1f7627b-971c-4fbd-9d19-e2207d6eb00c/MYDaily_ERD.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210106T085630Z&X-Amz-Expires=86400&X-Amz-Signature=39637d1d98a3e77609d372c413430ebc87ebbb2bb03b55682544ecf1b410ff16&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22MYDaily_ERD.png%22" width="70%">

---

### 4most 핵심 기능 🏃🏻‍♂️

- 회원 가입

- 키워드 설정 : 사용자는 각자 최대 4개의 키워드를 설정할 수 있습니다. 이후에 변경/수정이 가능합니다.

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%ED%82%A4%EC%9B%8C%EB%93%9C_%ED%82%A4%EC%9B%8C%EB%93%9C%EC%84%A0%ED%83%9D.png?raw=true" width="20%">

- 키워드별 목표 설정: 설정한 키워드 별로 금주의 목표를 설정할 수 있습니다.

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%EB%AA%A9%ED%91%9C%EC%84%A4%EC%A0%95_%EC%A3%BC%EC%B0%A8%EB%B3%84%EC%A1%B0%ED%9A%8C.jpg?raw=true" width="20%">

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%EB%AA%A9%ED%91%9C%EC%84%A4%EC%A0%95_%EC%B5%9C%EC%B4%88%20%EC%84%A4%EC%A0%95%20.png?raw=true" width="20%">

- 하루 기록: 설정한 목표를 달성하기 위해, 하루동안 했던 일을 기록할 수 있습니다.

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%EB%82%98%EC%9D%98%EA%B8%B0%EB%A1%9D_Main.png?raw=true" width="20%">

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%EB%82%98%EC%9D%98%20%EA%B8%B0%EB%A1%9D_%EA%B8%B0%EB%A1%9D%EC%B6%94%EA%B0%80.jpg?raw=true" width="20%">

- 리포트 및 회고: 금주의 목표와 지금까지 해온 기록들을 한 눈에 확인할 수 있습니다.

  <img src="https://github.com/TeamMyDaily/4most-Server/blob/dev/public/img/views/%ED%8F%89%EA%B0%80%EB%B0%8F%20%ED%9A%8C%EA%B3%A0_%ED%9A%8C%EA%B3%A0GET.jpg?raw=true" width="20%">

- 마이페이지

---

### Contributor 👩‍👧

| 최예진💛                                                 | 윤가영💚                     |
| ------------------------------------------------------- | --------------------------- |
| [Yejin6911](https://github.com/Yejin6911)               | [kyY00n](github.com/kyY00n) |
| 키워드 관련 API, 나의 기록 관련 API, 회원가입, 목표설정 | 회고 API, 마이페이지        |

### 