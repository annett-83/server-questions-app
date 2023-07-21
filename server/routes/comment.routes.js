const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Comment = require("../models/Comment");
router.post("/new", auth, async (req, res) => {
  try {
    const callUser = await User.findById(req.user._id);
    // если не учитель
    if (!callUser.isTeacher) {
      const newComment = await Comment.create({
        ...req.body,
        user: callUser._id,
      });
      res.status(201).send({ commentId: newComment._id });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже",
    });
  }
});

// отвеченые и неотвеченые вопросы
router.get("/:requestType", auth, async (req, res) => {
  try {
    // или отвеченые или неотвеченые вопросы (/open || /closed)
    const { requestType } = req.params;
    const callUser = await User.findById(req.user._id);
    const queryObject = {};
    // фильтр  учитель или ученик и вопросы отвеченые и неотвеченые
    if (callUser.isTeacher) {
      //если неотвеченые вопросы
      if (requestType === "open") {
        // объект без ответов в базе
        queryObject["answer"] = undefined;
        //если учитель фильтруеим по подходящим предметам трансформируем данные из массива айдишников в массив строка
        let SubjectIdArray = [];
        callUser.subjects.map((s) => SubjectIdArray.push(s.toString()));
        // $in: находим совпадения
        queryObject["subject"] = { $in: SubjectIdArray };
      } else {
        // если учитель его вопросы с ответами
        queryObject["answer.user"] = callUser._id;
      }
    } else {
      if (requestType === "open") {
        // если ученик и неотвеченые вопросы....
        queryObject["answer"] = undefined;
        // сам ученик задал
        queryObject["user"] = callUser._id;
      } else {
        // если ученик и отвеченые
        queryObject["answer"] = { $ne: undefined };
        // сам задал
        queryObject["user"] = callUser._id;
      }
    }
    // таблицы с отображением необходимых данных
    const userSelect = "_id, name";
    const populationArray = [
      {
        path: "subject",
        select: "_id name color",
      },
      {
        path: "user",
        select: userSelect,
      },
      {
        path: "answer.user",
        select: userSelect,
      },
    ];
    // console.log("Query Object: ", queryObject);
    // populate - это mongoose методе, отправляет нужные данные
    const list = await Comment.find(queryObject).populate(populationArray);
    res.send(list);
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже",
    });
  }
});
module.exports = router;
