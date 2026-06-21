import React, { useState } from "react";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { SiBlockchaindotcom } from "react-icons/si";
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import logo from "../assets/images/ebonyi_logo.png";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const isTaxpayer = user?.role?.toLowerCase() === "taxpayer";
  const isAuditor = user?.role?.toLowerCase() === "auditor";
  const isOfficer = user?.role?.toLowerCase() === "officer";

  const dashboardLink = isTaxpayer ? "/taxpayer-dashboard" : "/dashboard";

  const navLink = [
    {
      name: "Dashboard",
      link: dashboardLink,
      icon: <FaHome />,
    },

    // ❌ Hide Make Payment for auditor/officer
    ...(isAuditor || isOfficer
      ? []
      : [
          {
            name: "Make Payment",
            link: "/makepayment",
            icon: <MdOutlinePayment />,
          },
        ]),

    {
      name: "Transactions",
      link: "/history",
      icon: <GrTransaction />,
    },

    // Only auditor
    ...(isAuditor
      ? [
          {
            name: "Verify Records",
            link: "/vbr",
            icon: <SiBlockchaindotcom />,
          },
        ]
      : []),

    // Only auditor/officer
    ...(isAuditor || isOfficer
      ? [
          {
            name: "Revenue Records",
            link: "/revtp",
            icon: <IoIosSettings />,
          },
        ]
      : []),

    {
      name: "Profile",
      link: "/profile",
      icon: <CgProfile />,
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center p-3 bg-green-900 text-white fixed z-50 pt-6 cursor-pointer">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-green-900 text-white w-52
        transition-transform duration-300 z-40
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
      >
        <div className="flex flex-col h-screen">

          {/* Logo */}
          <div className="flex p-3 justify-center items-center border-b-2 border-gray-50 mt-16 md:mt-0">
            <img src={logo} alt="IGR LOGO" className="w-24 rounded-full" />
          </div>

          {/* Links */}
          <div className="flex flex-col mt-4">
            {navLink.map((data, index) => (
              <Link
                key={index}
                to={data.link}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-green-700 transition">
                  <span>{data.icon}</span>
                  <span>{data.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;