const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    // кто ответил только учитель isTeachert:true
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }, { _id : false },
  {
    timestamps: { createdAt: "created_at" },
  }
);

module.exports = model("Answer", schema);
