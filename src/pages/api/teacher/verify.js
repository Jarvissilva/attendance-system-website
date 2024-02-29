import jwt from "jsonwebtoken";
import cookie from "cookie";
import connectDatabase from "helpers/connectDatabase";
import TeacherModel from "models/teacher";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      // Connecting to database
      await connectDatabase();

      const { verificationToken } = req.body;

      const verifiedToken = jwt.verify(
        verificationToken,
        process.env.JWT_SECRET_KEY
      );

      const foundTeacher = await TeacherModel.findById(verifiedToken._id);

      if (!foundTeacher)
        return res.status(400).json({
          success: false,
          message: "Your link is not valid",
        });

      // Creating jwt token
      const token = jwt.sign(
        { _id: foundTeacher._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );

      // Set auth cookie in the user browser
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 604800,
          path: "/",
        })
      );

      res.status(200).json({
        success: true,
        message: "Verified successfully redirecting...",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
