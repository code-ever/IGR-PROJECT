import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaIdCard,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../services/api";

const Profile = () => {
  const [taxpayer, setTaxpayer] = useState( null );
  const [loading, setLoading] = useState( true );
  const [error, setError] = useState( "" );

  useEffect( () => {
    const fetchProfile = async () => {
      try {
        const res = await api.get( "/users/me" );
        console.log( res.data.data )
        setTaxpayer( res.data.data );
      } catch ( err ) {
        setError( "Unable to load taxpayer profile." );
      } finally {
        setLoading( false );
      }
    };

    fetchProfile();
  }, [] );

  if ( loading )
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Loading taxpayer profile...
      </div>
    );

  if ( error )
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-8">

        {/* Header */}
        <div className="flex items-center space-x-4 border-b pb-4">
          <FaUserCircle className="text-green-600" size={60} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Taxpayer Profile</h1>
            <p className="text-gray-500 text-sm">
              Internal Generated Revenue System
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <Section title="Personal Information">
          <ProfileItem label="Full Name" value={taxpayer.fullName} />
          <ProfileItem label="Phone Number" value={taxpayer.phoneNumber} />
          <ProfileItem label="Email Address" value={taxpayer.email} />
          <ProfileItem label="Role" value={taxpayer.role} />
        </Section>

        {/* Tax Identification */}
        <Section title="Tax Identification">
          <ProfileItem
            label="Taxpayer ID (TIN)"
            value={taxpayer.tin}
            icon={<FaIdCard />}
          />
          <ProfileItem label="Registration Date" value={taxpayer.createdAt} />
          <ProfileItem label="Tax Office" value={taxpayer.taxOffice} />
          <ProfileItem label="Tax Category" value={taxpayer.category} />
        </Section>

        {/* Business Information */}
        <Section title="Business Information (If Applicable)">
          <ProfileItem
            label="Business Name"
            value={taxpayer.businessName}
            icon={<FaBuilding />}
          />
          <ProfileItem label="Business Type" value={taxpayer.businessType} />
         
        </Section>

        {/* Tax Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCheckCircle className="text-green-600" size={28} />
            <div>
              <p className="font-semibold text-green-800">
                Tax Status: {taxpayer.status || "Active"}
              </p>
              <p className="text-sm text-green-700">
                All tax filings are up to date
              </p>
            </div>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
            View Tax History
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Section */
const Section = ( { title, children } ) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

/* Reusable Profile Item */
const ProfileItem = ( { label, value, icon } ) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start space-x-3">
    {icon && <div className="text-green-600 mt-1">{icon}</div>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

export default Profile;
