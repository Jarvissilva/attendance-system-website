import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import TeacherModel from "models/teacher";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Connecting to database
      await connectDatabase();

      if (!req.cookies.auth)
        return res
          .status(401)
          .json({ success: false, message: "Not logged in" });

      const verifiedToken = jwt.verify(
        req.cookies.auth,
        process.env.JWT_SECRET_KEY
      );

      if (!verifiedToken)
        return res.status(401).json({
          success: false,
          message: "User not logged in",
        });

      const foundTeacher = await TeacherModel.findById(verifiedToken._id);

      if (!foundTeacher) return res.status(401).json({ success: false });

      res.status(200).json({ success: true, teacher: foundTeacher });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default handler;
