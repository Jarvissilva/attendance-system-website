import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";

const handler = async (req, res) => {
  if (req.method == "DELETE") {
    try {
      // Checking if teacher is logged
      const verifiedToken = jwt.verify(
        req.cookies.auth,
        process.env.JWT_SECRET_KEY
      );

      // Connecting to database
      await connectDatabase();

      await ClassroomModel.findByIdAndDelete(req.query.classroom);

      res.status(200).json({
        success: true,
        message: "Classroom deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
