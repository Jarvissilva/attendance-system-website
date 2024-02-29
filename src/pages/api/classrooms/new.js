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

      const { name, students } = req.body;

      // Generating a 6 character code
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let classroomCode = "";

      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        classroomCode += characters[randomIndex];
      }

      await new ClassroomModel({
        code: classroomCode,
        name,
        teacher: verifiedToken._id,
        students,
      }).save();

      res.status(200).json({
        success: true,
        message: "Classroom succesfully created",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
