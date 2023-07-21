const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const list = await Subject.find();
    res.status(200).send(list);
  } catch (error) {
    res.status(500).json({
      message: "на сервере произошла ошибка.Попробуйте позже",
    });
  }
});

module.exports = router;
