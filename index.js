const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// express 서버를 구성합니다.
const app = express();

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
  // res.send("Hello World! 안녕하세요!");
  res.sendFile(__dirname + "/index.html");
});

// redis 클라이언트를 만들고.
const redisClient = redis.createClient(port_redis);

//3000번 포트를 받도록 설정해뒀습니다.
app.listen(port, () => console.log(`Server running on Port ${port}`));

// Create (LPUSH)
app.post("/users", async (req, res) => {
  try {
    const { id, name, phoneNumber, birth, address } = req.body;
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

// Update a user (HINCRBY)
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

// // DELETE /users/:id 요청 처리
// app.delete("/users/:id", async (req, res) => {
//   const id = req.params.id;

//   // id를 사용하여 해당 항목 삭제
//   await UserModel.findByIdAndDelete(id, (err, deletedItem) => {
//     if (err) {
//       console.error("삭제 실패:", err);
//       res.status(500).send("삭제 실패");
//     } else {
//       console.log("삭제 성공:", deletedItem);
//       res.send("삭제 성공");
//     }
//   });
// });

// // Delete
// app.delete("/users/:id", (req, res) => {
//   const userId = req.params.id;

//   UserModel.findByIdAndDelete(userId, (error, deletedUser) => {
//     if (error) {
//       console.error("MongoDB delete error:", error);
//       res.status(500).send(`Server Error 500: ${error.message}`);
//     } else if (deletedUser) {
//       redisClient.lrem("users", 0, JSON.stringify(deletedUser), (error) => {
//         if (error) {
//           console.error("Redis LREM error:", error);
//         }
//         res.send(deletedUser);
//       });
//     } else {
//       res.status(404).send("User not found 404");
//     }
//   });
// });

// // HyperLogLog (원소의 개수)
// app.get("/users/count", (req, res) => {
//   redisClient.pfcount("users", (error, count) => {
//     if (error) {
//       console.error("Redis PFCount error:", error);
//       res.status(500).send(`Server Error 500: ${error.message}`);
//     } else {
//       res.send({ count });
//     }
//   });
// });

// // Expire
// app.post("/users/:id/expire", (req, res) => {
//   const userId = req.params.id;
//   const expireTime = req.body.expireTime;

//   redisClient.expire(userId, expireTime, (error, result) => {
//     if (error) {
//       console.error("Redis EXPIRE error:", error);
//       res.status(500).send(`Server Error 500: ${error.message}`);
//     } else if (result === 1) {
//       res.send("Key expired");
//     } else {
//       res.status(404).send("Key not found");
//     }
//   });
// });
