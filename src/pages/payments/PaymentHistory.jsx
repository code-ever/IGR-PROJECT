import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { MdPending } from "react-icons/md";
import api from "../../services/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState( [] );
  const [fromDate, setFromDate] = useState( "" );
  const [toDate, setToDate] = useState( "" );
  const [sortOrder, setSortOrder] = useState( "newest" );
  const [loading, setLoading] = useState( false );
  const [status, setStatus] = useState( "" );

  // 👇 Get user (adjust depending on how you store auth)
  const user = JSON.parse( localStorage.getItem( "user" ) );

  // Fetch payment transactions
  const getHistory = async () => {

    try {
      setLoading( true );

      // ✅ Role-based endpoint
      const endpoint =
        user?.role === "auditor" || user?.role === "officer"
          ? "/payments"
          : "/payments/user";

      const res = await api.get( endpoint );
      setStatus( res.data.status )
      console.log( res.data.status )
      const data = Array.isArray( res.data )
        ? res.data
        : res.data?.data || [];

      setPayments( data );
      setLoading( false );
    } catch ( err ) {
      console.error( "Failed to fetch payments:", err );
      setLoading( false );
    }
  };

  useEffect( () => {
    getHistory();
  }, [] );

  // Status badge
  const getStatusBadge = ( status ) => {
    switch ( status ) {
      case "success":
        return (
          <span className="flex items-center gap-2 font-medium text-green-600">
            <IoCheckmarkCircle size={18} />
            Successful
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-2 font-medium text-red-600">
            <IoCloseCircle size={18} />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 font-medium text-yellow-600">
            <MdPending size={18} />
            Pending
          </span>
        );
    }
  };

  // Filter & sort payments
  const filteredPayments = payments
    .filter( ( p ) => {
      const date = p.createdAt?.slice( 0, 10 );
      if ( fromDate && date < fromDate ) return false;
      if ( toDate && date > toDate ) return false;
      return true;
    } )
    .sort( ( a, b ) => {
      if ( sortOrder === "newest" )
        return new Date( b.createdAt ) - new Date( a.createdAt );
      return new Date( a.createdAt ) - new Date( b.createdAt );
    } );

  const formatCurrency = ( value ) =>
    `₦${Number( value ).toLocaleString()}`;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <p className="flex items-center text-gray-700">
          <Link to="/dashboard" className="flex items-center text-green-700 font-medium">
            <IoIosArrowBack size={18} className="mr-1" />
            Home
          </Link>
          <span className="ml-2">/ Payment History</span>
        </p>
        <p className="font-semibold text-lg">IGR Payments</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={( e ) => setFromDate( e.target.value )}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={( e ) => setToDate( e.target.value )}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Sort By</label>
          <select
            value={sortOrder}
            onChange={( e ) => setSortOrder( e.target.value )}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={getHistory}
            className="bg-green-700 text-white rounded-md px-4 py-2 w-full hover:bg-green-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No transactions found
          </div>
        ) : (
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Revenue Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map( ( item ) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">
                    {item.createdAt?.slice( 0, 10 )}
                  </td>
                  <td className="p-3">
                    {item.revenueType?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {formatCurrency( item.amount )}
                  </td>
                  <td className="p-3">
                    {getStatusBadge( status )}
                  </td>
                </tr>
              ) )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
