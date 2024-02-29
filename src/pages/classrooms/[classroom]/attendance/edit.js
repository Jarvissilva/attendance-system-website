import { useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";
import fetchApi from "helpers/fetchApi";
import Toast from "components/toast";

const EditAttendance = ({ classroom }) => {
  const [attendances, setAttendances] = useState(classroom.attendances);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetchApi(
      `/classrooms/${router.query.classroom}/attendance/edit`,
      "POST",
      { attendances }
    );
    setMessage(res.message);
  };

  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleCellClick = (studentId, date) => {
    const updatedAttendances = attendances.map((attendance) => {
      if (attendance.date === date) {
        const updatedAttendance = {
          ...attendance,
          attendance: attendance.attendance.map((record) => {
            if (record.studentId === studentId) {
              return {
                ...record,
                status: record.status === "P" ? "A" : "P", // Toggle status
              };
            }
            return record;
          }),
        };
        return updatedAttendance;
      }
      return attendance;
    });

    setAttendances(updatedAttendances);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => history.back()}>
            <svg
              fill="#000000"
              height="30px"
              width="30px"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 330 330"
            >
              <path
                id="XMLID_92_"
                d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
              />
            </svg>
          </button>
          <h1 className="text-[clamp(2rem,5vw,2.5rem)] text-center font-black capitalize leading-tight">
            Edit Attendance
          </h1>
        </div>
        <button
          className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 self-center"
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
      <Toast text={message} />
      <div className="overflow-x-auto p-5">
        <table className="w-full">
          <thead className="text-left">
            <tr className="font-thin">
              <th className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                Roll Number
              </th>
              {classroom.attendances.map((attendance) => (
                <th
                  key={attendance._id}
                  className="border border-gray-200 p-3 whitespace-nowrap"
                >
                  {formatDate(attendance.date)}
                </th>
              ))}
              <th className="border border-gray-200 p-3 sticky right-0 z-20 bg-white whitespace-nowrap">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {classroom.students.map((student) => {
              const totalDates = attendances.length;
              let presentCount = 0;
              attendances.forEach((attendance) => {
                const studentAttendance = attendance.attendance.find(
                  (record) => record.studentId === student._id
                );
                if (studentAttendance) {
                  if (studentAttendance.status === "P") {
                    presentCount++;
                  }
                }
              });

              const totalAttendance =
                presentCount + (totalDates - presentCount);
              const presentPercentage =
                (presentCount / totalAttendance) * 100 || 0;

              return (
                <tr key={student.rollNumber}>
                  <td className="border border-gray-200 p-2 sticky left-0 z-20 bg-white">
                    {student.rollNumber}
                  </td>
                  {attendances.map((attendance) => {
                    const studentAttendance = attendance.attendance.find(
                      (record) => record.studentId === student._id
                    );
                    return (
                      <td
                        key={attendance._id}
                        className={`border border-gray-200 p-2 ${
                          studentAttendance && studentAttendance.status === "P"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() =>
                          handleCellClick(student._id, attendance.date)
                        }
                      >
                        {studentAttendance ? studentAttendance.status : "-"}
                      </td>
                    );
                  })}
                  <td className="border border-gray-200 p-2 sticky right-0 z-20 bg-white">
                    {presentCount} / {totalAttendance} (
                    {presentPercentage.toFixed(2)}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies.auth) {
    return {
      redirect: {
        destination: "/teacher/login",
        permanent: false,
      },
    };
  }

  const verifiedToken = jwt.verify(
    ctx.req.cookies.auth,
    process.env.JWT_SECRET_KEY
  );

  await connectDatabase();

  const foundClassroom = await ClassroomModel.findOne({
    _id: ctx.params.classroom,
    teacher: verifiedToken._id,
  }).sort({ "attendances.date": -1 });

  return { props: { classroom: JSON.parse(JSON.stringify(foundClassroom)) } };
}

EditAttendance.protected = true;

export default EditAttendance;
