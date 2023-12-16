const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const { json } = require("express");

// express 서버를 구성합니다.
const app = express();

const UserSchema = new mongoose.Schema({
  name: String,
  type: String,
  ID: Number,
});

// 이용할 유저 모델 스키마.
const UserModel = mongoose.model("User", UserSchema);

// 이용할 포트를 설정해주고.
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 3000;
const MONGOURI = "mongodb://localhost:27017/redis-test";

// bodyParser는 request로 들어오는 인자들을 해석하기 위해 필요합니다.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("MongoDB connected");

    const user = await UserModel.create({ name: "bruno", ID: 12 });
    console.log(user);

    console.log("Mongoose 연결 성공!");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", (req, res) => {
  res.send("Hello World! 안녕하세요!");
});

// redis 클라이언트를 만들고.
const redisClient = redis.createClient(port_redis);

//3000번 포트를 받도록 설정해뒀습니다.
app.listen(port, () => console.log(`Server running on Port ${port}`));

app.get(`/findById/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const cachedUser = await redisClient.get(`findByID/${id}`);
    if (cachedUser) {
      console.log("Data found in Redis cache");
      res.send(JSON.parse(cachedUser));
    } else {
      const user = await UserModel.findOne({ ID: id });

      if (user) {
        // Redis에 데이터를 캐싱합니다.
        redisClient.set(`findByID/${id}`, JSON.stringify(user));
        res.send(user);
        console.log(user);
      } else {
        res.status(404).send("User not found 404");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server Error 500: ${error.message}`);
  }

  //   // 데이터 한 개를 추가합니다.
  //   await UserModel.create({ name: "bruno", ID: 12 });

  //   console.log("Mongoose 연결 성공!");

  //   const user = await UserModel.findOne({ ID: id });
  //   if (user) {
  //     res.send(user);
  //   } else {
  //     res.status(404).send("User not found 404");
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send(`Server Error 500: ${error.message}`);
  // }
});
