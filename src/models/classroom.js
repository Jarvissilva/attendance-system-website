import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    students: [
      {
        name: String,
        rollNumber: { type: String, trim: true },
      },
    ],
    attendances: [
      {
        date: Date,
        attendance: [
          {
            studentId: mongoose.Schema.ObjectId,
            status: { type: String, enum: ["P", "A"] },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Classroom ||
  mongoose.model("Classroom", classroomSchema);
