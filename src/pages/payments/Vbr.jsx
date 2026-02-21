import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { IoIosArrowBack } from "react-icons/io";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { MdPending } from "react-icons/md";
import { Link } from "react-router-dom";
// import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";



const PAGE_SIZE = 10;

const Vbr = () => {
    const [payments, setPayments] = useState( [] );
    const [loading, setLoading] = useState( false );
    const [setatus, setStatus] = useState( "" );

    // Filters & Sorting
    const [fromDate, setFromDate] = useState( "" );
    const [toDate, setToDate] = useState( "" );
    const [revenueType, setRevenueType] = useState( "" );
    const [sortOrder, setSortOrder] = useState( "newest" );

    // Pagination
    const [currentPage, setCurrentPage] = useState( 1 );

    // Add Payment Form State
    const [newPayment, setNewPayment] = useState( {
        revenueTypeId: "",
        amount: "",
        periodReference: "",
        paymentGatewayReference: "",
        paymentGatewayProvider: "",
    } );
    const [adding, setAdding] = useState( false );

    // Fetch all payments
    const fetchPayments = async () => {
        try {
            setLoading( true );
            const res = await api.get( "/payments" );
            // console.log( res )
            // console.log( res.data.status );   // "success"
            // console.log( res.data.message );  // "All payments retrieved successfully"
            const data = Array.isArray( res.data ) ? res.data : res.data?.data || [];
            setStatus( res.data.status )
            setPayments( data );
            setLoading( false );
        } catch ( err ) {
            console.error( "Failed to fetch payments:", err );
            setLoading( false );
        }
    };

    useEffect( () => {
        fetchPayments();
    }, [] );

    // Add a new payment
    const handleAddPayment = async ( e ) => {
        e.preventDefault();
        try {
            setAdding( true );
            const res = await api.post( "/payments", newPayment );
            console.log( res )
            setPayments( ( prev ) => [res.data, ...prev] );
            setNewPayment( {
                revenueTypeId: "",
                amount: "",
                periodReference: "",
                paymentGatewayReference: "",
                paymentGatewayProvider: "",
            } );
            setAdding( false );
            alert( "Payment added successfully!" );
        } catch ( err ) {
            console.error( "Failed to add payment:", err );
            setAdding( false );
            alert( "Failed to add payment" );
        }
    };

    // Status badge
    const getStatusBadge = ( status ) => {
        const normalizedStatus = status?.toLowerCase();
        switch ( normalizedStatus ) {
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

    const formatCurrency = ( value ) => `₦${Number( value ).toLocaleString()}`;

    // Apply filters and sorting
    const filteredPayments = payments
        .filter( ( p ) => {
            const date = p.periodReference?.slice( 0, 10 ) || p.createdAt?.slice( 0, 10 );
            if ( fromDate && date < fromDate ) return false;
            if ( toDate && date > toDate ) return false;
            if ( revenueType && p.revenueType?.name !== revenueType ) return false;
            return true;
        } )
        .sort( ( a, b ) => {
            if ( sortOrder === "newest" )
                return new Date( b.periodReference || b.createdAt ) - new Date( a.periodReference || a.createdAt );
            return new Date( a.periodReference || a.createdAt ) - new Date( b.periodReference || b.createdAt );
        } );

    // Pagination logic
    const totalPages = Math.ceil( filteredPayments.length / PAGE_SIZE );
    const paginatedPayments = filteredPayments.slice(
        ( currentPage - 1 ) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Unique revenue types for filter
    const revenueTypes = Array.from( new Set( payments.map( ( p ) => p.revenueType?.name ) ) ).filter( Boolean );

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full box-border overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <p className="flex items-center text-gray-700">
                    <Link to="/" className="flex items-center text-green-700 font-medium">
                        <IoIosArrowBack size={18} className="mr-1" />
                        Home
                    </Link>
                    <span className="ml-2">/ VBR Payments</span>
                </p>
                <p className="font-semibold text-lg">All Payment Records</p>
            </div>

            {/* Add Payment Form */}
            {/* <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-gray-700 mb-4">Add New Payment</h2>
                <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleAddPayment}>
                    <input
                        type="text"
                        placeholder="Revenue Type ID"
                        value={newPayment.revenueTypeId}
                        onChange={( e ) => setNewPayment( { ...newPayment, revenueTypeId: e.target.value } )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newPayment.amount}
                        onChange={( e ) => setNewPayment( { ...newPayment, amount: e.target.value } )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                    <input
                        type="date"
                        placeholder="Period Reference"
                        value={newPayment.periodReference}
                        onChange={( e ) => setNewPayment( { ...newPayment, periodReference: e.target.value } )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Payment Gateway Ref"
                        value={newPayment.paymentGatewayReference}
                        onChange={( e ) =>
                            setNewPayment( { ...newPayment, paymentGatewayReference: e.target.value } )
                        }
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Payment Gateway Provider"
                        value={newPayment.paymentGatewayProvider}
                        onChange={( e ) =>
                            setNewPayment( { ...newPayment, paymentGatewayProvider: e.target.value } )
                        }
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                    />
                    <button
                        type="submit"
                        disabled={adding}
                        className="bg-green-700 text-white rounded-md px-4 py-2 w-full hover:bg-green-600 transition md:col-span-1"
                    >
                        {adding ? "Adding..." : "Add Payment"}
                    </button>
                </form>
            </div> */}

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={( e ) => setFromDate( e.target.value )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={( e ) => setToDate( e.target.value )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Revenue Type</label>
                    <select
                        value={revenueType}
                        onChange={( e ) => setRevenueType( e.target.value )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="">All</option>
                        {revenueTypes.map( ( type ) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ) )}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Sort By</label>
                    <select
                        value={sortOrder}
                        onChange={( e ) => setSortOrder( e.target.value )}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => setCurrentPage( 1 )}
                        className="bg-green-700 text-white rounded-md px-4 py-2 w-full hover:bg-green-600 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg w-full overflow-x-auto">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : paginatedPayments.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No transactions found</div>
                ) : (
                    <table className="min-w-[500px] w-full table-auto text-left border-collapse text-sm md:text-base">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Period</th>
                                <th className="p-3">Revenue Type</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Payment Ref</th>
                                <th className="p-3">Gateway</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPayments.map( ( item ) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3 break-words">{item.periodReference?.slice( 0, 10 ) || item.createdAt?.slice( 0, 10 )}</td>
                                    <td className="p-3 break-words">{item.user?.fullName || "N/A"}</td>
                                    <td className="p-3 break-words">{item?.period || "N/A"}</td>
                                    <td className="p-3 break-words">{item.revenueType?.name || "N/A"}</td>
                                    <td className="p-3 break-words">{formatCurrency( item.amount )}</td>
                                    <td className="p-3 break-words">{item.paymentGatewayReference || "N/A"}</td>
                                    <td className="p-3 break-words">{item.paymentGatewayProvider || "N/A"}</td>
                                    <td className="p-3">  {getStatusBadge( setatus || "N/A" )}</td>
                                    <td className="p-3 flex items-center"><Link to={`/taxPayerDetail/${item.id}`} className="flex items-center"><GrView size={20} />View</Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage( ( p ) => Math.max( p - 1, 1 ) )}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage( ( p ) => Math.min( p + 1, totalPages ) )}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Vbr;
