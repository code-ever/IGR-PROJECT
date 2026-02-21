import React, { useState } from "react";
import loginImage from "../../assets/images/loginImage copy.jpg";
import log from "../../assets/images/ebonyi_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth(); // removed loading from here
  const navigate = useNavigate();

  const [email, setEmail] = useState( "" );
  const [password, setPassword] = useState( "" );
  const [submitting, setSubmitting] = useState( false ); // 🔥 local loading state

  const handleSubmit = async ( e ) => {
    e.preventDefault();

    setSubmitting( true ); // 🔥 start immediately

    try {
      await login( email, password );

      toast.success( "Login successful" );

      setTimeout( () => {
        navigate( "/dashboard" );
      }, 800 );

    } catch ( error ) {
      toast.error( "Invalid email or password" );
      setSubmitting( false ); // 🔥 stop only if error
    }
  };

  return (
    <div className="w-full h-screen">
      <ToastContainer />

      {/* Overlay Loader */}
      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg">
            <span className="w-6 h-6 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-green-800 font-semibold">
              Authenticating...
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundImage: `url(${loginImage})`,
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 h-full w-full flex justify-center items-center">
          <div className="flex flex-col">
            <div className="flex justify-center mb-[-40px] z-20">
              <img src={log} alt="logo" className="w-34 rounded-full" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 w-96 rounded-md shadow-lg"
            >
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  disabled={submitting}
                  className="text-gray-600 border border-gray-200 rounded-md p-2 disabled:bg-gray-100"
                  placeholder="email@example.com"
                  value={email}
                  onChange={( e ) => setEmail( e.target.value )}
                  required
                />
              </div>

              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  disabled={submitting}
                  className="text-gray-600 border border-gray-200 rounded-md p-2 disabled:bg-gray-100"
                  placeholder="Password"
                  value={password}
                  onChange={( e ) => setPassword( e.target.value )}
                  required
                />
              </div>

              <div className="py-3">
                <Link to="/" className="text-sm text-green-900">
                  Forgot Password?
                </Link>
              </div>
              <div>
                <div className="mt-4 text-sm text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-green-700 font-semibold">
                    Rgister
                  </Link>
                </div>
              </div>
              <div className="mt-4 mb-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-800 flex justify-center items-center gap-2 text-white rounded-md p-2 hover:bg-green-600 transition w-full disabled:opacity-60"
                >
                  {submitting && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {submitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
