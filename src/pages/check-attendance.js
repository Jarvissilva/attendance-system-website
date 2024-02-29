import { useState } from "react";
import Link from "next/link";
import fetchApi from "helpers/fetchApi";
import Toast from "components/toast";

const CheckAttendance = () => {
  const [formData, setFormData] = useState({
    classroomCode: "",
    rollNumber: "",
  });

  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState("");

  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const calculatePercentage = (attendanceData) => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(
      (attendance) => attendance.status === "P"
    ).length;
    const percentage = (presentDays / totalDays) * 100;
    return percentage.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchApi("/check-attendance", "POST", formData);
    setMessage(res.success ? "" : "Attendance not found");
    setAttendance(res.success ? res.attendance : null);
    setFormData({ ...formData, rollNumber: "" });
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-[clamp(2.5rem,5vw,3rem)] text-center font-black capitalize leading-tight">
        Check Attendance
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="classroomCode"
          placeholder="Enter your classroom code"
          onChange={(e) =>
            setFormData({ ...formData, classroomCode: e.target.value })
          }
          value={formData.classroomCode}
          className="w-full bg-sky-50 border border-gray-200 rounded-md outline-none px-4 py-3"
          required
        />
        <input
          type="text"
          name="rollNumber"
          placeholder="Enter your roll number"
          onChange={(e) =>
            setFormData({ ...formData, rollNumber: e.target.value })
          }
          value={formData.rollNumber}
          className="w-full bg-sky-50 border border-gray-200 rounded-md outline-none px-4 py-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 inline-block"
        >
          Check Attendance
        </button>
      </form>
      <div className="flex flex-col items-center justify-center overflow-x-auto p-5">
        {attendance && (
          <>
            <p className="text-center mb-5 text-lg font-semibold">
              Overall Attendance : {calculatePercentage(attendance)}%
            </p>
            <table>
              <thead>
                <tr className="text-left">
                  <th className="border border-gray-200 p-3 sticky right-0 z-20 bg-white whitespace-nowrap">
                    Date
                  </th>
                  {attendance.map((record) => (
                    <th
                      className="border border-gray-200 p-3 sticky right-0 z-20 bg-white whitespace-nowrap"
                      key={record.date}
                    >
                      {formatDate(record.date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 sticky right-0 z-20 bg-white whitespace-nowrap">
                    Status
                  </td>
                  {attendance.map((record) => (
                    <td
                      className="border border-gray-200 p-2 sticky left-0 z-20 bg-white"
                      key={record.date}
                    >
                      {record.status}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}
        <Toast text={message} />
      </div>
    </div>
  );
};

export default CheckAttendance;
