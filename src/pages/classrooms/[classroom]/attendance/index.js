import { useRouter } from "next/router";
import Link from "next/link";
import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";

const Attendance = ({ classroom }) => {
  const router = useRouter();
  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString(undefined, options);
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
            Attendance
          </h1>
        </div>
        <Link
          href={`/classrooms/${router.query.classroom}/attendance/new`}
          className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 self-center"
        >
          New
        </Link>
      </div>
      <div className="overflow-x-auto p-5">
        <div className="flex justify-end">
          <Link
            href={`/classrooms/${router.query.classroom}/attendance/edit`}
            className="text-right bg-green-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Edit
          </Link>
        </div>
        <table className="w-full">
          <thead className="text-left">
            <tr className="font-thin">
              <th className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                Roll Number
              </th>
              {classroom.attendances.map((attendance) => (
                <th
                  key={attendance.date}
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
              const totalDates = classroom.attendances.length;
              let presentCount = 0;
              classroom.attendances.forEach((attendance) => {
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
                  {classroom.attendances.map((attendance) => {
                    const studentAttendance = attendance.attendance.find(
                      (record) => record.studentId === student._id
                    );
                    return (
                      <td
                        key={attendance.date}
                        className="border border-gray-200 p-2"
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

  if (!foundClassroom) return { notFound: true };

  return { props: { classroom: JSON.parse(JSON.stringify(foundClassroom)) } };
}

Attendance.protected = true;

export default Attendance;
