import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method == "GET") {
    try {
      if (!req.cookies.auth)
        return res.status(401).json({
          success: false,
          message: "Not logged in",
        });

      const verifiedToken = jwt.verify(
        req.cookies.auth,
        process.env.JWT_SECRET_KEY
      );

      if (!verifiedToken)
        return res.status(401).json({
          success: false,
          message: "User not logged in",
        });

      res.setHeader(
        "Set-Cookie",
        "auth=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict"
      );

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
