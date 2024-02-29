import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      // Connecting to database
      await connectDatabase();

      const { classroomCode, rollNumber } = req.body;

      const foundClassroom = await ClassroomModel.findOne({
        code: classroomCode,
      });

      if (!foundClassroom) {
        return res.status(404).json({
          success: false,
          message: "Classroom or student not found",
        });
      }

      const foundStudent = foundClassroom.students.find(
        (student) => student.rollNumber === rollNumber
      );
      if (!foundStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found in the classroom",
        });
      }

      const studentAttendance = foundClassroom.attendances.map((attendance) => {
        const record = attendance.attendance.find(
          (record) =>
            record.studentId.toString() === foundStudent._id.toString()
        );
        return {
          date: attendance.date,
          status: record.status,
        };
      });

      res.status(200).json({
        success: true,
        attendance: studentAttendance,
        message: "Attendance found",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export default handler;
