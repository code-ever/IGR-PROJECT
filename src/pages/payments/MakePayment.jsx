import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

const MakePayment = () => {
  const navigate = useNavigate();
  const [revenueTypes, setRevenueTypes] = useState([]);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [revenueTypeId, setRevenueTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [periodReference, setPeriodReference] = useState("");
  const [periodOptions, setPeriodOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch revenue types
  useEffect(() => {
    const getRevenueTypes = async () => {
      try {
        const res = await api.get("/revenue-types");
        const types = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setRevenueTypes(types);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load revenue types");
      }
    };

    getRevenueTypes();
  }, []);

  // Handle revenue selection
  const handleRevenueChange = (e) => {
    const selectedId = e.target.value;
    setRevenueTypeId(selectedId);

    const revenue = revenueTypes.find((r) => r.id === selectedId);

    if (revenue) {
      setSelectedRevenue(revenue);
      setAmount(revenue.amount || revenue.defaultAmount || "");

      const now = new Date();
      let options = [];

      // YEARLY
      if (revenue.period === "yearly") {
        options = Array.from({ length: 5 }, (_, i) => `${now.getFullYear() - i}`);
      }

      // MONTHLY
      else if (revenue.period === "monthly") {
        options = Array.from({ length: 12 }, (_, i) => {
          const month = (i + 1).toString().padStart(2, "0");
          return `${now.getFullYear()}-${month}`; // YYYY-MM
        });
      }

      // WEEKLY
      else if (revenue.period === "weekly") {
        options = Array.from({ length: 8 }, (_, i) => {
          const start = new Date(now);
          start.setDate(now.getDate() + i * 7);
          return start.toISOString().slice(0, 10); // YYYY-MM-DD
        });
      }

      setPeriodOptions(options);
      setPeriodReference("");
    } else {
      setSelectedRevenue(null);
      setAmount("");
      setPeriodOptions([]);
      setPeriodReference("");
    }
  };

  // Submit payment
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!revenueTypeId || !amount || !periodReference) {
      toast.error("All fields are required");
      return;
    }

    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded");
      return;
    }

    const reference = "T" + Date.now();

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: "nwabueze.h.iyke@gmail.com",
      amount: Number(amount) * 100,
      currency: "NGN",
      ref: reference,
      callback: function (response) {
        recordPayment(response.reference);
      },
      onClose: function () {
        toast.info("Payment popup closed");
      },
    });

    handler.openIframe();
  };

  // Record payment to backend and redirect to dashboard
  const recordPayment = async (paystackReference) => {
    try {
      setLoading(true);

      const payload = {
        revenueTypeId,
        amount: Number(amount),
        periodReference,
        paymentGatewayReference: paystackReference,
        paymentGatewayProvider: "paystack",
      };

      await api.post("/payments", payload);

      toast.success("Payment successful and recorded");

      // Redirect to dashboard
      navigate("/dashboard");

      // Reset form (optional)
      setRevenueTypeId("");
      setAmount("");
      setPeriodReference("");
      setSelectedRevenue(null);
      setPeriodOptions([]);
    } catch (error) {
      let message = "Payment failed";
      const backendMessage = error?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        message = backendMessage[0];
      } else if (backendMessage) {
        message = backendMessage;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-[500px] max-w-lg">
          <p className="text-center py-3 font-bold text-xl md:text-2xl">Make Your Payment</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 py-4 text-gray-600">
            {/* Revenue Type */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Revenue Type</label>
              <select
                value={revenueTypeId}
                onChange={handleRevenueChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select Revenue Type</option>
                {revenueTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.period})
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            {selectedRevenue?.description && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-md text-sm text-green-800">
                {selectedRevenue.description}
              </div>
            )}

            {/* Amount */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Amount</label>
              <input
                disabled
                type="number"
                value={amount}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Period Reference */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Period Reference</label>
              <select
                value={periodReference}
                onChange={(e) => setPeriodReference(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select Period</option>
                {periodOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-800 text-white rounded-md py-2 mt-2 hover:bg-green-600 transition disabled:opacity-60 flex justify-center items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        </div>

        <div className="max-w-md text-gray-700 space-y-3">
          <p className="font-bold text-xl md:text-2xl">Payment Information</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Your payment details are secured.</li>
            <li>Authentication is handled securely.</li>
            <li>Your payment is recorded immediately after validation.</li>
          </ul>

          <p className="text-sm mt-4">
            You can track your payment{" "}
            <Link to="/history" className="text-green-700 font-semibold hover:underline">
              Status
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;