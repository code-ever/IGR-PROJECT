import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const TaxpayerDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPayment = async () => {
      try {
        const response = await api.get(`payments/${id}`);
        setPayment(response.data.data); // IMPORTANT: nested data
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayment();
  }, [id]);

  if (!payment) return <div className="p-10 text-center">Loading receipt...</div>;

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white w-full max-w-2xl shadow-lg rounded-lg p-8 relative overflow-hidden">

        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <h1 className="text-6xl font-bold rotate-[-30deg] select-none">
            IGR EBONYI STATE
          </h1>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10">

          {/* HEADER */}
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold">EBONYI STATE IGR</h1>
            <p className="text-sm text-gray-500">Official Payment Receipt</p>
          </div>

          {/* BODY */}
          <div className="space-y-4 text-sm">

            <ReceiptRow label="Receipt ID" value={payment.id} />
            <ReceiptRow label="Amount Paid" value={`₦${Number(payment.amount).toLocaleString()}`} />
            <ReceiptRow label="Payment Period" value={payment.periodReference} />
            <ReceiptRow label="Payment Frequency" value={payment.period} />

            <div className="border-t my-3"></div>

            <ReceiptRow label="Revenue Type" value={payment.revenueType?.name} />
            <ReceiptRow label="Description" value={payment.revenueType?.description} />

            <div className="border-t my-3"></div>

            <ReceiptRow label="Paid By" value={payment.user?.fullName} />
            <ReceiptRow label="Business Name" value={payment.user?.businessName} />
            <ReceiptRow label="Email" value={payment.user?.email} />

            <div className="border-t my-3"></div>

            <ReceiptRow label="Gateway Provider" value={payment.paymentGatewayProvider} />
            <ReceiptRow label="Gateway Reference" value={payment.paymentGatewayReference} />

            <div className="border-t my-3"></div>

            <ReceiptRow label="Blockchain Hash" value={payment.blockchainTxHash} mono />
            <ReceiptRow
              label="Date"
              value={new Date(payment.createdAt).toLocaleString()}
            />
          </div>

          {/* FOOTER */}
          <div className="text-center border-t mt-6 pt-4 text-xs text-gray-500">
            This receipt confirms successful payment to Ebonyi State IGR
          </div>

          {/* PRINT & RECONCILE BUTTONS */}
          <div className="flex justify-around items-center print:hidden mt-6">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-900 cursor-pointer text-white rounded"
            >
              Print Receipt
            </button>
            <Link
              to={`/payments/verify/${payment.id}`}
              className="px-4 py-2 bg-green-900 text-white rounded"
            >
              Reconcile
            </Link>
          </div>

        </div> {/* End Main Content */}
      </div>
    </div>
  );
};

// Reusable Row Component
const ReceiptRow = ({ label, value, mono }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-600">{label}</span>
    <span className={`${mono ? "font-mono text-xs break-all" : ""} text-right`}>
      {value || "N/A"}
    </span>
  </div>
);

export default TaxpayerDetails;