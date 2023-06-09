const express = require("express");
const userRouter = express.Router();
const { userModel } = require("../model/model");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth");

userRouter.get("/", (req, res) => {
  res.send("helo");
});

// registration
userRouter.post("/registration", async (req, res) => {
  // console.log(req.body)
  const { email, password, location, age } = req.body;

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new userModel({ email, password: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "Registration has been done!" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await userModel.find({ email });
    console.log(user);
    if (user) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successfull!",
            token: jwt.sign({ userID: user[0]._id }, "shhhhh"),
          });
        } else {
          res.status(400).send({ msg: "Login Failed! Wrong Credentials!" });
        }
      });
    } else {
      res.status(400).send({ msg: "Error" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// users data
userRouter.get("/data", auth, async (req, res) => {
  try {
    const user = await userModel.find();
    res.send({ user: user });
  } catch (erro) {
    res.send("error");
  }
});

module.exports = { userRouter };
