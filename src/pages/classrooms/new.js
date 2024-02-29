import { useState } from "react";
import fetchApi from "helpers/fetchApi";
import Toast from "components/toast";

const NewClassroom = () => {
  const [formData, setFormData] = useState({ name: "", students: [] });
  const [student, setStudent] = useState({ name: "", rollNumber: "" });
  const [message, setMessage] = useState("");

  const addStudent = () => {
    if (!student.name || !student.rollNumber) return;

    const newStudent = { name: student.name, rollNumber: student.rollNumber };
    setFormData((prevFormData) => ({
      ...prevFormData,
      students: [...prevFormData.students, newStudent],
    }));
    setStudent({ name: "", rollNumber: "" });
  };

  const deleteStudent = (index) => {
    setFormData((prevFormData) => {
      const updatedStudents = [...prevFormData.students];
      updatedStudents.splice(index, 1);
      return { ...prevFormData, students: updatedStudents };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchApi("/classrooms/new", "POST", formData);
    setMessage(res.message);
    setFormData({ name: "", students: [] });
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
            New Classroom
          </h1>
        </div>
        <button
          // type="submit"
          form="newClassForm"
          className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 self-center"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Toast text={message} />
      <form id="newClassForm" className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-3">
          <label className="font-semibold">Class Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            className="border border-gray-200 p-4 rounded-md"
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-semibold">Add Students</label>
          <input
            type="text"
            name="studentName"
            placeholder="Enter student name"
            value={student.name}
            className="border border-gray-200 p-4 rounded-md"
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            required
          />
          <input
            type="text"
            name="rollNumber"
            placeholder="Enter student roll number"
            value={student.rollNumber}
            className="border border-gray-200 p-4 rounded-md"
            onChange={(e) =>
              setStudent({ ...student, rollNumber: e.target.value })
            }
            required
          />
          <button
            className="bg-blue-500 text-white font-semibold px-4 py-3 rounded-md hover:bg-blue-600 self-end"
            type="button"
            onClick={addStudent}
          >
            Add
          </button>
        </div>
        <div className="space-y-5">
          <p className="font-semibold">Students</p>
          {formData.students && (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                    Name
                  </th>
                  <th className="text-left border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                    Roll Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.students.map((student, index) => (
                  <tr key={student._id}>
                    <td className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap">
                      {student.name}
                    </td>
                    <td className="border border-gray-200 p-3 sticky left-0 z-20 bg-white whitespace-nowrap flex justify-between">
                      {student.rollNumber}
                      <button
                        type="button"
                        onClick={() => deleteStudent(index)}
                        className="border border-gray-200 px-4 py-2 bg-red-500 rounded-md text-white"
                      >
                        <svg
                          fill="#fff"
                          version="1.1"
                          id="Capa_1"
                          width="20px"
                          height="20px"
                          viewBox="0 0 482.428 482.429"
                        >
                          <g>
                            <g>
                              <path
                                d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
			c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
			h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
			C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
			C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
			c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
			c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
			V115.744z"
                              />
                              <path
                                d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"
                              />
                              <path
                                d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"
                              />
                              <path
                                d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
			c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"
                              />
                            </g>
                          </g>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </form>
    </>
  );
};

NewClassroom.protected = true;

export default NewClassroom;
