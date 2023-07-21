const { Schema, model } = require("mongoose");
const Answer = require("./Answer").schema;

const schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // кто оставил вопрос только ученик isTeacher:false
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer:  {
      type:Answer,
      required: false,
    },
    //может ответить только isTeacher с одинаковым subject что и comment
    price: {
      type: Number,
    },
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
  },
  {
    timestamps: {createdAt: "created_at" },
  }
);
module.exports = model("Comment", schema);
