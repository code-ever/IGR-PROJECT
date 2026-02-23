import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../assets/images/loginImage.jpg";
// import log from "../../assets/images/logo.png";
import log from "../../assets/images/ebonyi_logo.png";


const Register = () => {
    const navigate = useNavigate();
    const { loading } = useAuth();

    const [fullName, setFullName] = useState( "" );
    const [email, setEmail] = useState( "" );
    const [phoneNumber, setPhoneNumber] = useState( "" );
    const [businessName, setBusinessName] = useState( "" );
    const [password, setPassword] = useState( "" );

    // ✅ Added preload state
    const [preloading, setPreloading] = useState( false );

    const handleSubmit = async ( e ) => {
        e.preventDefault();

        if ( preloading ) return; // prevent multiple clicks
        setPreloading( true );

        try {
            const res = await api.post( "/auth/register", {
                fullName,
                email,
                phoneNumber,
                password,
                businessName,
            } );

            console.log( res );
            const { user, token } = res.data;

            localStorage.setItem( "token", token );
            localStorage.setItem( "user", JSON.stringify( user ) );

            navigate( "/dashboard" );

        } catch ( err ) {
            console.error( err );
            alert( "Registration failed" );
        } finally {
            setPreloading( false ); // stop loader
        }
    };

    return (
        <div className="w-full h-screen pb-20">
            <div
                style={{
                    backgroundImage: `url(${loginImage})`,
                    height: "100vh",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-black/50 h-full w-full">
                    <div className="flex justify-center items-center h-screen">
                        <div className="flex flex-col">
                            <div className="flex justify-center mb-[-40px] z-20">
                                <img src={log} alt="logo" className="w-28 rounded-full" />
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="bg-white p-6 w-96 rounded-md shadow-lg"
                            >
                                <h2 className="text-xl font-bold mb-4 text-gray-700">
                                    Create Account
                                </h2>

                                <Input label="Full Name" value={fullName} onChange={setFullName} />
                                <Input label="Email" type="email" value={email} onChange={setEmail} />
                                <Input label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
                                <Input label="Business Name" value={businessName} onChange={setBusinessName} />
                                <Input label="Password" type="password" value={password} onChange={setPassword} />

                                <button
                                    type="submit"
                                    disabled={preloading}
                                    className="bg-green-800 mt-4 text-white cursor-pointer rounded-md p-2 hover:bg-green-600 transition w-full disabled:opacity-60 flex items-center justify-center"
                                >
                                    {preloading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                />
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Register"
                                    )}
                                </button>

                                <div className="mt-4 text-sm text-center mb-20">
                                    Already have an account?{" "}
                                    <Link to="/" className="text-green-700 font-semibold">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Input = ( { label, type = "text", value, onChange } ) => (
    <div className="flex flex-col mt-3">
        <label className="text-sm text-gray-400">{label}</label>
        <input
            type={type}
            className="text-gray-600 border border-gray-200 rounded-md p-2"
            value={value}
            onChange={( e ) => onChange( e.target.value )}
            required
        />
    </div>
);

export default Register;
