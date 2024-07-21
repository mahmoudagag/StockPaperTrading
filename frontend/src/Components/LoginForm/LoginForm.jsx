import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import videoBg from "../../Assets/video.mp4";
import GlobalContext from "../../ContextWrapper.js";

import "./LoginForm.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export const LoginForm = (props) => {
  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { setUser, setToken } = useContext(GlobalContext);

  useEffect(() => {
    let storedToken = localStorage.getItem("Token");
    if (storedToken) {
      navigate("/");
    }
  });

  //Validation logic for Login Form:
  const validateForm = () => {
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
  };

  const submit = async (e) => {
    validateForm();
    e.preventDefault();

    //send request to login route
    let url = `${URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      navigate("/");
    } else if (response.status === 401) {
      setEmailError("Incorrect Credentials");
      setPasswordError("Incorrect Credentials");
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
            <h1 className="text-center text-[36px] font-bold">Login</h1>

            <div className="relative w-[100%] h-[50px] my-[30px] mx[0px]">
              <input
                className="input"
                type="text"
                placeholder="Email"
                required
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <FaUser className="icon" />
              <label className="errorLabel">{emailError}</label>
            </div>
            <div className="relative w-[100%] h-[50px] my-[30px] mx[0px] ">
              <input
                className="input"
                type="password"
                placeholder="Password"
                required
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <span className="focus-input100"></span>
              <FaLock className="icon" />
              <label className="errorLabel">{passwordError}</label>
            </div>

            <div className="remember-me">
              <label>
                <input type="checkbox" id="rememberMe" /> Remember me
              </label>

              <a href="#"> Forgot Password?</a>
            </div>

            <button className="button" type="submit">
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account?
                <Link to="/register"> Register </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
