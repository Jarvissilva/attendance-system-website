import Link from "next/link";

const Home = ({ teacher }) => {
  return (
    <>
      <h1 className="text-[clamp(2.5rem,5vw,3rem)] text-center font-black capitalize leading-tight">
        Easily Manage Your Attendance
      </h1>
      <div className="text-center space-y-2">
        <p className="text-lg">Are you a teacher?</p>
        <div className="space-x-4">
          {teacher ? (
            <Link
              href="/classrooms"
              className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 inline-block"
            >
              View Classrooms
            </Link>
          ) : (
            <>
              <Link
                href="/teacher/register"
                className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 inline-block"
              >
                Register
              </Link>
              <Link
                href="/teacher/login"
                className="bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 inline-block"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg">Are you a student?</p>
        <Link
          href="/check-attendance"
          className="bg-white text-black px-5 py-3 font-semibold border border-blue-500 rounded-md shadow-md hover:border-black inline-block"
        >
          Check Attendance
        </Link>
      </div>
    </>
  );
};

export default Home;
