const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
  username,
  email,
  password: hashedPassword
});

    res.json({
      message: "User created successfully"
    });

  }

  catch(err){
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if(user.status !== "approved"){

  return res.status(403).json({
    message: "Waiting for admin approval"
  });

}

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(

      {
        id: user._id,
        email: user.email,
username: user.username
      },

      "secretkey",

      {
        expiresIn: "7d"
      }

    );

    res.json({
      token,
      user
    });

  }

  catch(err){

  console.log("FULL ERROR:");
  console.log(err);

  res.status(500).json({
    message: err.message
  });

}

});

module.exports = router;