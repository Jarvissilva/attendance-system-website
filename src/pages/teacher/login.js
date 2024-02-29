import { useState } from "react";
import Link from "next/link";
import fetchApi from "helpers/fetchApi";
import Toast from "components/toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchApi("/teacher/login", "POST", formData);
    setMessage(res.message);
    setFormData({ email: "" });
  };

  return (
    <>
      <Toast text={message} />
      <div className="w-full space-y-4">
        <h1 className="text-[clamp(2.5rem,5vw,3rem)] text-center font-black capitalize leading-tight">
          Welcome Back
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              value={formData.email}
              className="w-full bg-sky-50 border border-gray-200 rounded-md outline-none px-4 py-3 pl-12"
              required
            />
            <span className="absolute top-1/2 left-4 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.33398 4.16667C2.87756 4.16667 2.50065 4.54357 2.50065 5V15C2.50065 15.4564 2.87756 15.8333 3.33398 15.8333H16.6673C17.1238 15.8333 17.5007 15.4564 17.5007 15V5C17.5007 4.54357 17.1238 4.16667 16.6673 4.16667H3.33398ZM0.833984 5C0.833984 3.6231 1.95708 2.5 3.33398 2.5H16.6673C18.0442 2.5 19.1673 3.6231 19.1673 5V15C19.1673 16.3769 18.0442 17.5 16.6673 17.5H3.33398C1.95708 17.5 0.833984 16.3769 0.833984 15V5Z"
                    fill="#000"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.984696 4.52154C1.24862 4.14449 1.76823 4.0528 2.14527 4.31673L10.0007 9.81554L17.8562 4.31673C18.2332 4.0528 18.7528 4.14449 19.0167 4.52154C19.2807 4.89858 19.189 5.41818 18.8119 5.68211L10.4786 11.5154C10.1917 11.7163 9.80977 11.7163 9.52284 11.5154L1.1895 5.68211C0.812463 5.41818 0.720767 4.89858 0.984696 4.52154Z"
                    fill="#000"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
          <button
            className="w-full bg-blue-500 text-white px-5 py-3 font-semibold rounded-md shadow-md hover:bg-blue-600 inline-block"
            type="submit"
          >
            Login
          </button>
          <p className="text-center">
            Don't have a account?{" "}
            <Link
              href="/teacher/register"
              className="text-blue-500 hover:text-blue-300"
            >
              Register{" "}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
