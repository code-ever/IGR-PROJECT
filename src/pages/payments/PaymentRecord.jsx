import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlineEdit, MdDelete } from "react-icons/md"; // ✅ NEW ICONS
import api from "../../services/api";

const PaymentRecord = () => {
  const [payments, setPayments] = useState( [] );
  const [loading, setLoading] = useState( true );
  const [error, setError] = useState( "" );

  // ✅ Update Modal State
  const [selectedPayment, setSelectedPayment] = useState( null );
  const [showModal, setShowModal] = useState( false );
  const [updating, setUpdating] = useState( false );

  // Fetch Payments
  useEffect( () => {
    const fetchPayments = async () => {
      try {
        const res = await api.get( "/payments" );
        const data = res.data?.data || res.data || [];
        setPayments( data );
      } catch ( err ) {
        setError( "Failed to load payment records." );
      } finally {
        setLoading( false );
      }
    };

    fetchPayments();
  }, [] );

  // ✅ Open Update Modal
  const handleEditClick = ( payment ) => {
    setSelectedPayment( payment );
    setShowModal( true );
  };

  // ✅ Handle Update
  const handleUpdate = async () => {
    try {
      setUpdating( true );

      const payload = {
        amount: selectedPayment.amount,
        paymentGatewayReference: selectedPayment.paymentGatewayReference,
        paymentGatewayProvider: selectedPayment.paymentGatewayProvider,
      };

      const res = await api.patch( `/payments/${selectedPayment.id}`, payload );

      setPayments( ( prev ) =>
        prev.map( ( p ) => ( p.id === selectedPayment.id ? res.data : p ) )
      );

      setShowModal( false );
    } catch ( err ) {
      alert( "Update failed" );
    } finally {
      setUpdating( false );
    }
  };

  // ✅ Handle Delete
  const handleDelete = async ( id ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if ( !confirmDelete ) return;

    try {
      await api.delete( `/payments/${id}` );

      setPayments( ( prev ) => prev.filter( ( p ) => p.id !== id ) );
    } catch ( err ) {
      alert( "Delete failed" );
    }
  };

  if ( loading )
    return <div className="p-6 text-center">Loading payment records...</div>;

  if ( error )
    return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Tax Payment Records
        </h1>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-500">
            <FiSearch size={60} className="mb-4 text-gray-400" />
            <p className="text-lg font-semibold">No Payment Records Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-900 text-white text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Receipt No.</th>
                  <th className="p-3">Tax Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Update</th>
                  <th className="p-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {payments.map( ( payment ) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="p-3">
                      {new Date( payment.createdAt ).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {payment.paymentGatewayReference}
                    </td>
                    <td className="p-3">
                      {payment.revenueType?.name}
                    </td>
                    <td className="p-3">
                      ₦{Number( payment.amount ).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={payment.status} />
                    </td>

                    {/* ✅ UPDATE ICON */}
                    <td className="p-3 text-center">
                      <button onClick={() => handleEditClick( payment )}>
                        <MdOutlineEdit
                          size={22}
                          className="text-blue-600 hover:text-blue-800"
                        />
                      </button>
                    </td>

                    {/* ✅ DELETE ICON */}
                    <td className="p-3 text-center">
                      <button onClick={() => handleDelete( payment.id )}>
                        <MdDelete
                          size={22}
                          className="text-red-600 hover:text-red-800"
                        />
                      </button>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ UPDATE MODAL */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">Update Payment</h2>

            <div className="space-y-3">
              <input
                type="number"
                value={selectedPayment.amount}
                onChange={( e ) =>
                  setSelectedPayment( {
                    ...selectedPayment,
                    amount: e.target.value,
                  } )
                }
                className="w-full border rounded p-2"
              />

              <input
                type="text"
                value={selectedPayment.paymentGatewayReference}
                onChange={( e ) =>
                  setSelectedPayment( {
                    ...selectedPayment,
                    paymentGatewayReference: e.target.value,
                  } )
                }
                className="w-full border rounded p-2"
              />

              <input
                type="text"
                value={selectedPayment.paymentGatewayProvider}
                onChange={( e ) =>
                  setSelectedPayment( {
                    ...selectedPayment,
                    paymentGatewayProvider: e.target.value,
                  } )
                }
                className="w-full border rounded p-2"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>

            <button
              onClick={() => setShowModal( false )}
              className="mt-2 w-full bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ( { status } ) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  if ( status === "Paid" || status === "success" )
    return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;

  if ( status === "Pending" )
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;

  return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;
};

export default PaymentRecord;