import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetchApi from "helpers/fetchApi";

const Verify = ({ setReAuthenticate }) => {
  const [message, setMessage] = useState("Verifying please wait");
  const router = useRouter();

  const verifyLoginToken = async () => {
    if (router.query.token) {
      const res = await fetchApi("/teacher/verify", "POST", {
        verificationToken: router.query.token,
      });
      setMessage(res.message);
      setReAuthenticate(true);
      setTimeout(
        () => router.push(res.success ? "/classrooms" : "/teacher/login"),
        2000
      );
    }
  };

  useEffect(() => {
    verifyLoginToken();
  }, [router.query.token]);

  return (
    <div className="w-full space-y-4">
      <div className="bg-sky-50 p-[clamp(1.5rem,5vw,2.5rem)] border border-gray-200 rounded-md">
        <p className="text-center text-2xl font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default Verify;
