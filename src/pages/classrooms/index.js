import Link from "next/link";
import jwt from "jsonwebtoken";
import connectDatabase from "helpers/connectDatabase";
import ClassroomModel from "models/classroom";

const Classrooms = ({ classrooms }) => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-[clamp(2.5rem,5vw,3rem)] font-black capitalize leading-tight">
          Classrooms
        </h1>
        <Link
          href="/classrooms/new"
          className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 self-center"
        >
          New
        </Link>
      </div>
      <div className="flex flex-row flex-wrap gap-5 justify-start">
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <div
              className="w-full sm:w-[47%] lg:w-[30%] p-5 border border-gray-200  rounded-md"
              key={classroom._id}
            >
              <div className="flex row justify-between">
                <h2 className="text-[clamp(1rem,5vw,1.5rem)] font-bold capitalize">
                  {classroom.name}
                </h2>
                <Link
                  href={`/classrooms/${classroom._id}/edit`}
                  className="text-green-500 hover:text-green-300"
                >
                  Edit
                </Link>
              </div>
              <p>
                Classroom Code:{" "}
                <span className="font-bold">{classroom.code}</span>
              </p>
              <Link
                href={`/classrooms/${classroom._id}/attendance`}
                className="text-blue-500 mt-2 hover:text-blue-300"
              >
                View Attendance
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">No classroom created</p>
        )}
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

  const foundClassrooms = await ClassroomModel.find({
    teacher: verifiedToken._id,
  });

  return { props: { classrooms: JSON.parse(JSON.stringify(foundClassrooms)) } };
}

Classrooms.protected = true;

export default Classrooms;
