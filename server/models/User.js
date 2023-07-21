const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    sex: { type: String, enum: ["male", "female", "other"] },
  
  },
  {
    timestamps: true,
  }
);
// виртуальное подтверждение isTeacher? true || false
schema.virtual('isTeacher')
  .get(function () {
    return ((this.subjects) && (this.subjects.length > 0));
  });
// если юзер тичер
schema.methods.teachesSubject = function (subjectId) {
  return ((this.subjects) && (this.subjects.filter(s => s.toString() === subjectId.toString()).length > 0));
};


module.exports = model("User", schema);

