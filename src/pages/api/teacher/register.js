import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import TeacherModel from "models/teacher";
import sendMail from "helpers/sendMail";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      // Connecting to database
      await connectDatabase();

      const { name, email } = req.body;

      // Checking if teacher exists
      const foundTeacher = await TeacherModel.exists({ email });
      if (foundTeacher)
        return res.status(400).json({
          success: false,
          message: "Teacher already exists with this email",
        });

      const newTeacher = await new TeacherModel({ name, email }).save();

      // Creating jwt token
      const token = jwt.sign(
        { _id: newTeacher._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 300,
        }
      );

      await sendMail({
        to: email,
        subject: "Verify your login",
        html: `<p>Welcome to our website please verify your login by using this link: <a href="${process.env.SITE_URL}/teacher/verify?token=${token}">Verify Now</a></p>`,
      });

      res.status(200).json({
        success: true,
        message:
          "Registered successfully check your mail we sent you a link to login",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
