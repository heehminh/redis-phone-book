const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// express 서버를 구성합니다.
const app = express();

app.use(express.static("views"));

const UserSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  birth: Number,
  address: String,
});

// 이용할 유저 모델 스키마.
const UserModel = mongoose.model("User", UserSchema);

// 이용할 포트를 설정해주고.
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 3000;
const MONGOURI = "mongodb://localhost:27017/redis-test";

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// redis 클라이언트를 만들고.
const redisClient = redis.createClient(port_redis);

//3000번 포트를 받도록 설정해뒀습니다.
app.listen(port, () => console.log(`Server running on Port ${port}`));

// Create (LPUSH)
app.post("/users", async (req, res) => {
  try {
    const { name, phoneNumber, birth, address } = req.body;
    const newUser = new UserModel({
      name,
      phoneNumber,
      birth,
      address,
    });

    const savedUser = await newUser.save();
    redisClient.lpush("users", JSON.stringify(savedUser), (error) => {
      if (error) {
        console.error("Redis LPUSH error:", error);
        res.status(500).send(`Server Error 500: ${error.message}`);
      } else {
        res.send(savedUser);
      }
    });
  } catch (error) {
    console.error("MongoDB save error:", error);
    res.status(500).send(`Server Error 500: ${error.message}`);
  }
});

app.set("view engine", "ejs");

// Read all users
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.render("users", { users });
  } catch (error) {
    console.error("MongoDB find error:", error);
    res.status(500).send(`Server Error 500: ${error.message}`);
  }
});

// Read (HMGET)
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id; // 숫자를 문자열로 변환

    const user = await UserModel.findById(userId);
    if (user) {
      const userObject = user.toObject();
      res.send(userObject);
    } else {
      res.status(404).send("User not found 404");
    }
  } catch (error) {
    console.error("MongoDB find error:", error);
    res.status(500).send(`Server Error 500: ${error.message}`);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { phoneNumber } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { phoneNumber },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("MongoDB update error:", error);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

// List 길이 확인
app.get("/count", async (req, res) => {
  try {
    const listLength = await new Promise((resolve, reject) => {
      redisClient.llen("users", (error, length) => {
        if (error) {
          console.error("Redis LLEN error:", error);
          reject(error);
        } else {
          console.log("List length:", length);
          resolve(length);
        }
      });
    });

    res.render("count", { listLength });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send(`Server Error 500: ${error.message}`);
  }
});
