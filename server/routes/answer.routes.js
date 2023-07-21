const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Answer = require("../models/Answer");
router.post("/new", auth, async (req, res) => {
  try {
    const callUser = await User.findById(req.user._id);
    const commentId = req.body.comment;
    // вопросы для ответа с id
    const answeredComment = await Comment.findById(commentId);
    //техт для ошибки
    let answerErrorMessage = "";
    // если нет вопроса
    if (!answeredComment) {
      answerErrorMessage = "No such comment";
    } else if (answeredComment.answer) {
      // если есть вопрос, но с ответом
      answerErrorMessage = "Comment already answered";
      // если у учителя не совподает subject c comment.subject вызываю метод из userscheme
    } else if (!callUser.teachesSubject(answeredComment.subject)) {
      answerErrorMessage = answerErrorMessage = "Teacher not teaches Subject";
    } else {
      const newAnswer = new Answer({
        ...req.body,
        user: callUser._id,
      });
      // добовляет в базе ответ
      await Comment.findByIdAndUpdate(commentId, { answer: newAnswer });
      res.status(201).send({});
    }
    // если есть ошибки, то 401
    if (answerErrorMessage !== "") {
      {
        res.status(401).json({ message: answerErrorMessage });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже",
    });
  }
});
module.exports = router;
