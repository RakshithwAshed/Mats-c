const express = require("express");

const User = require("../models/User");

const router = express.Router();


// GET PENDING USERS
router.get("/pending", async (req, res) => {

  try {

    const users = await User.find({
      status: "pending"
    });

    res.json(users);

  }

  catch(err){

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// APPROVE USER
router.put("/approve/:id", async (req, res) => {

  try {

    await User.findByIdAndUpdate(req.params.id, {
      status: "approved"
    });

    res.json({
      message: "User approved"
    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;