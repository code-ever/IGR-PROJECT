import React, { useState } from 'react'
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { SiBlockchaindotcom } from "react-icons/si";
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import logo from '../assets/images/ebonyi_logo.png'
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState( false ); // toggle state for mobile
    const { user } = useAuth()
    const navLink = [
        { name: 'Dashboard', link: '/dashboard', icon: <FaHome /> },
        ...( user?.role === 'auditor' || user?.role === 'officer' ? [] : [{ name: 'Make Payment', link: '/makepayment', icon: <MdOutlinePayment /> },] ),

        { name: 'Transactions', link: '/history', icon: <GrTransaction /> },
        ...( user?.role === 'auditor' ? [{ name: 'Verify Records', link: '/vbr', icon: <SiBlockchaindotcom /> }] : [] ),

        // ...( user?.role === 'auditor' || user?.role === 'officer' ? [{ name: 'Payment Records', link: '/paymentrecords', icon: <HiOutlineNewspaper /> }] : [] ),
        // ...( user?.role === 'auditor' || user?.role === 'officer' ? [{ name: "Memeber's Records", link: '/membertrecords', icon: <HiOutlineNewspaper /> }] : [] ),

        { name: 'Profile', link: '/profile', icon: <CgProfile /> },
        // { name: 'Settings', link: '/settings', icon: <IoIosSettings /> },
        ...( user?.role === 'auditor' || user?.role === 'officer' ? [{ name: 'Revenues', link: '/revtp', icon: <IoIosSettings /> },] : [] ),

    ]

    return (
        <>
            {/* Hamburger icon for mobile */}
            <div className="md:hidden flex items-center p-3 bg-green-900 text-white fixed z-50 pt-6 cursor-pointer">
                <button onClick={() => setMobileOpen( !mobileOpen )}>
                    {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-screen bg-green-900 text-white w-52
                transition-transform duration-300 z-40
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            `}>
                <div className="flex flex-col h-screen">
                    {/* Logo */}
                    <div className='flex p-3 justify-center items-center border-b-2 border-gray-50 mt-16 md:mt-0'>
                        <img src={logo} alt="IGR LOGO" className='w-24 rounded-full' />
                    </div>

                    {/* Navigation */}
                    {navLink.map( ( data, index ) => (
                        <div className="text-white" key={index}>
                            <Link to={data.link} onClick={() => setMobileOpen( false )}>
                                <div className="flex items-center gap-3 px-4 py-3 hover:bg-green-700">
                                    <span>{data.icon}</span>
                                    <span>{data.name}</span>
                                </div>
                            </Link>
                        </div>
                    ) )}
                </div>
            </div>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={() => setMobileOpen( false )}
                ></div>
            )}
        </>
    )
}

export default Sidebar
