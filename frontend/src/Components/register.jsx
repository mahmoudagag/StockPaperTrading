import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import videoBg from "../Assets/video.mp4";
import GlobalContext from "../ContextWrapper";

import "./LoginForm/LoginForm.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export const Register = () => {

  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken, setUser } = useContext(GlobalContext);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [redirectBool, setRedirectBool] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let storedToken = localStorage.getItem("Token");
    if (storedToken) {
      navigate("/");
    }
  });

  //send new user to database
  const submit = async (e) => {
    e.preventDefault();

    let url = `${URL}/auth/register`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    if (response.ok) {
      var result = await response.json();
      setUser(result.user);
      setToken(result.token);
      if (document.getElementById("rememberMe").checked) {
        localStorage.setItem("Token", result.token);
      }
    } else if (response.status === 409) {
      setEmailError("Email already exists");
    } else {
      setEmailError("something went wrong");
      setPasswordError("something went wrong");
    }
  };

  return (
    <div>
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        className="video absolute inset-0 w-full h-full object-cover"
      />
      <div className="h-screen flex items-center justify-center">
        <div className="font-poppins w-[420px] bg-[transparent] border-solid border-[2px] border-[rgba(255,255,255,.2)] backdrop-blur-[30px] shadow-md text-[#fff] rounded-[10px] py-[30px] px-[40px] realtive z-10">
          <form onSubmit={submit}>
            <h1 className="text-center text-[36px] font-bold">Please Register</h1>

            <div className="relative w-[100%] h-[50px] my-[30px] mx[0px]">
              <input
                className="input"
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="icon" />
            </div>

            <div className="relative w-[100%] h-[50px] my-[30px] mx[0px]">
              <input
                className="input"
                type="text"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser className="icon" />
            </div>
            <div className="relative w-[100%] h-[50px] my-[30px] mx[0px] ">
              <input
                className="input"
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input100"></span>
              <FaLock className="icon" />
            </div>

            <div className="remember-me">
              <label>
                {" "}
                <input type="checkbox" id="rememberMe" /> Remember me{" "}
              </label>
              <a href="#"> Forgot Password?</a>
            </div>

            <button className="button" type="submit">
              {" "}
              Submit{" "}
            </button>

            <div className="register-link">
              <p>
                Have an account?
                <Link to="/login"> Log In Here </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
