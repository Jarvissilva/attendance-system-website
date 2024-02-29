import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      // Checking if teacher is logged
      const verifiedToken = jwt.verify(
        req.cookies.auth,
        process.env.JWT_SECRET_KEY
      );

      // Connecting to database
      await connectDatabase();

      const { date, attendance } = req.body;

      const foundClassroom = await ClassroomModel.findById(req.query.classroom);

      if (!foundClassroom)
        return res.status(404).json({
          success: false,
          message: "Classroom not found",
        });

      foundClassroom.attendances.push({
        date: date,
        attendance,
      });

      await foundClassroom.save();

      res.status(200).json({
        success: true,
        message: "Attendance succesfully taken",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
