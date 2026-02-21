import React, { useState, useRef, useEffect, use } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [open, setOpen] = useState( false );
    const dropdownRef = useRef();
    const { logout, user } = useAuth()
    // Close dropdown if clicked outside
    const navigate = useNavigate();

    useEffect( () => {
        const handleClickOutside = ( e ) => {
            if ( dropdownRef.current && !dropdownRef.current.contains( e.target ) ) {
                setOpen( false );
            }
        };
        document.addEventListener( "mousedown", handleClickOutside );
        return () => document.removeEventListener( "mousedown", handleClickOutside );
    }, [] );


    const Logout = () => {
        logout()
        navigate( '/login' )
    }
    return (
        <header className="w-full h-16 bg-white shadow flex items-center justify-between fixed top-0 px-6 md:px-20 md:pr-52">
            {/* Left Side */}
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 pl-6 md:pl-2">
                IGR EBONYI STATE
            </h1>

            {/* Right Side - User Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen( !open )}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <span className="text-gray-700 font-medium uppercase">Hi, {user?.fullName.slice(0,4)}</span>
                    <img
                        src="https://i.pravatar.cc/40?img=12"
                        alt="User"
                        className="w-10 h-10 rounded-full border cursor-pointer"
                    />
                </button>

                {/* Dropdown Menu */}
                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            Welcome
                            <span className="font-semibold text-gray-800 uppercase">&nbsp;{user?.fullName.slice(0,4)}</span>
                        </div>

                        {/* <Link to='/' className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                            ⚙️ Settings
                        </Link> */}

                        <button onClick={Logout} className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">
                            🚪 Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
