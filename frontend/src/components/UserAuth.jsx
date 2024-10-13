import { FcGoogle } from "react-icons/fc";
import { RiLoginBoxFill } from "react-icons/ri";
import Input from "./Input";
import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storeInSession } from "../utils/sessionStorage";
import { UserContext } from "../App";

function UserAuth({ type }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    user: { accessToken },
    setUser,
  } = useContext(UserContext);

  const emailRegex =
    /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/;
  const emailValidate = (email) => {
    return emailRegex.test(email);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    if (fullName.length < 3 && type === "sign-up") {
      return toast.error("Full Name can't be less than 3 characters!");
    }

    if (!email) {
      return toast.error("Email Field can't be Empty!!!");
    }
    if (email) {
      const isValidEmail = emailValidate(email);

      if (!isValidEmail) {
        return toast.error("Invalid Email !!!");
      }
    }
    if (password.length < 6) {
      return toast.error("Password must be atleast 6 characters long!!!");
    }

    // Sending data to server
    await axios
      .post(`/${type}`, {
        fullName,
        email,
        password,
      })
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUser({ ...data });
      })
      .catch(({ response }) => toast.error(response.data.error));
  };

  return !accessToken ? (
    <div className="flex flex-col md:h-3/4 p-4 md:flex-row gap-4 md:items-center md:mt-44">
      <div className="w-4/6 h-1/4 mx-auto md:w-2/5">
        <img
          className="w-4/6 h-1/4 mx-auto"
          src={type === "sign-up" ? "sign-up.jpg" : "sign-in.jpg"}
          alt=""
        />
      </div>

      <form onSubmit={handleFormSubmit} className="md:w-3/5 lg:w-2/5">
        <ToastContainer />
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="p-4 text-3xl font-bold">
            {type === "sign-up" ? "Join us Today" : "Welcome Back"}
          </div>
          {type === "sign-up" ? (
            <Input
              type={"text"}
              placeholder={"Full Name..."}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          ) : (
            ""
          )}
          <Input
            type={"email"}
            placeholder={"Email..."}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type={"password"}
            placeholder={"Password..."}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleFormSubmit}
            className="capitalize flex gap-2 items-center bg-black text-white px-4 py-2 rounded-lg"
            type="submit"
          >
            <RiLoginBoxFill className="text-2xl" />
            {type.replace("-", " ")}
          </button>

          {type === "sign-up" ? (
            <div className="text-xs">
              Already have an account?{" "}
              <Link className="text-purple-500" to={"/sign-in"}>
                Login
              </Link>{" "}
              here...
            </div>
          ) : (
            <div className="text-xs">
              Don't have an account yet?{" "}
              <Link className="text-purple-500" to={"/sign-up"}>
                Sign Up
              </Link>{" "}
              here...
            </div>
          )}

          <div className="flex w-full items-center gap-2 p-4">
            <div className="w-1/2 border-2 h-1"></div>
            <div className="text-xs">OR</div>
            <div className="w-1/2 border-2 h-1"></div>
          </div>
          <button className="bg-black flex items-center gap-2 text-white px-4 py-2 rounded-lg">
            <FcGoogle className="text-2xl" />
            Sign In with Google
          </button>
        </div>
      </form>
    </div>
  ) : (
    <Navigate to={"/"} />
  );
}

export default UserAuth;
