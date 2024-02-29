import { useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";
import fetchApi from "helpers/fetchApi";
import Toast from "components/toast";

const NewAttendance = ({ classroom }) => {
  const [attendance, setAttendance] = useState([]);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetchApi(
      `/classrooms/${router.query.classroom}/attendance/new`,
      "POST",
      {
        date: new Date().toISOString(),
        attendance,
      }
    );
    setAttendance([]);
    setMessage(res.message);
  };

  const handleAttendance = (status) => {
    if (count < classroom.students.length) {
      setAttendance((prevAttendanceData) => [
        ...prevAttendanceData,
        { studentId: classroom.students[count]._id, status },
      ]);
      setCount(count + 1);
    }
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
            Take Attendance
          </h1>
        </div>
        <button
          className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 self-center"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Toast text={message} />
      <div className="flex flex-col justify-center items-center gap-5 p-5">
        {classroom.students[count] && (
          <>
            <h2 className="text-[clamp(1.5rem,5vw,2rem)] text-center font-bold leading-tight">
              Roll Number: {classroom.students[count].rollNumber}
            </h2>
            <div className="flex flex-row gap-5">
              <button
                className="w-full md:w-auto bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600"
                onClick={() => handleAttendance("P")}
              >
                Present
              </button>
              <button
                className="w-full md:w-auto bg-red-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-red-600"
                onClick={() => handleAttendance("A")}
              >
                Absent
              </button>
            </div>
          </>
        )}
        <h2 className="text-[clamp(1.2rem,5vw,1.7rem)] font-semibold">
          Attendance for {new Date().toISOString().split("T")[0]}
        </h2>
        <table className="w-[60%]">
          <thead>
            <tr>
              <th className="text-center border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                Roll Number
              </th>
              <th className="text-center border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {attendance &&
              attendance.map((attendance, index) => (
                <tr className="text-center" key={index}>
                  <td className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                    {
                      classroom.students.find(
                        (student) => student._id === attendance.studentId
                      ).rollNumber
                    }
                  </td>
                  <td className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                    {attendance.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          onClick={() => location.reload()}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400"
        >
          Reset
        </button>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const verifiedToken = jwt.verify(
    ctx.req.cookies.auth,
    process.env.JWT_SECRET_KEY
  );

  await connectDatabase();

  const foundClassroom = await ClassroomModel.findOne({
    _id: ctx.params.classroom,
    teacher: verifiedToken._id,
  });

  return { props: { classroom: JSON.parse(JSON.stringify(foundClassroom)) } };
}

NewAttendance.protected = true;

export default NewAttendance;
