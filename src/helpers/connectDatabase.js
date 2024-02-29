import mongoose from "mongoose";

import TeacherModel from "models/teacher";
import ClassroomModel from "models/classroom";

const connectDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  return mongoose.connect(process.env.MONGODB_CONNECTION_URI);
};

export default connectDatabase;
