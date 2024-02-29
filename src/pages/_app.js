import "style.css";
import { useEffect, useState } from "react";
import { Poppins, Redressed } from "next/font/google";
import Error from "next/error";
import fetchApi from "helpers/fetchApi";
import Loader from "components/loader";
import Link from "next/link";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const redressed = Redressed({
  subsets: ["latin"],
  weight: ["400"],
});

const App = ({ Component, pageProps }) => {
  const [teacher, setTeacher] = useState(null);
  const [reAuthenticate, setReAuthenticate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authenticateTeacher = async () => {
    setIsLoading(true);
    const res = await fetchApi("/teacher/authenticate", "GET");
    setTeacher(res.success ? res.teacher : null);
    setIsLoading(false);
    setReAuthenticate(false);
  };

  const logoutTeacher = async () => {
    const res = await fetchApi("/teacher/logout", "GET");
    setReAuthenticate(true);
    console.log(res);
  };

  useEffect(() => {
    authenticateTeacher();
  }, [reAuthenticate]);

  return (
    <>
      <header className="flex justify-between items-center px-[clamp(1rem,5vw,5rem)] py-[clamp(1rem,5vw,2.2rem)] border">
        <Link
          className={`text-[clamp(2.5rem,5vw,3rem)] font-black ${redressed.className} leading-none`}
          href="/"
        >
          AttendanceSys
        </Link>
        {teacher ? (
          <button
            onClick={logoutTeacher}
            className="bg-blue-500 text-white font-medium px-[clamp(1.25rem,5vw,1.5rem)] py-[clamp(0.5rem,5vw,.6rem)] rounded-md hover:bg-blue-700"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/teacher/login"
            className="bg-blue-500 text-white font-medium px-[clamp(1.25rem,5vw,1.5rem)] py-[clamp(0.5rem,5vw,.6rem)] rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </header>
      {Component.protected ? (
        isLoading ? (
          <Loader />
        ) : teacher ? (
          <main
            className={`px-[clamp(1.25rem,6vw,6rem)] py-[clamp(1.25rem,6vw,3rem)] lg:px-[clamp(6rem,14vw,12rem)] space-y-10 ${poppins.className}`}
          >
            <Component
              {...pageProps}
              teacher={teacher}
              setReAuthenticate={setReAuthenticate}
            />
          </main>
        ) : (
          <Error statusCode={401} title="Please login to access this page" />
        )
      ) : (
        <main
          className={`flex flex-col justify-center items-center gap-2 px-[clamp(1.25rem,6vw,6rem)] py-24 lg:px-[clamp(6rem,35vw,33rem)] ${poppins.className}`}
        >
          <Component
            {...pageProps}
            teacher={teacher}
            setReAuthenticate={setReAuthenticate}
          />
        </main>
      )}
    </>
  );
};

export default App;
