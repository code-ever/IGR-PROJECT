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

  /* ================= FETCH REVENUE TYPES ================= */
  useEffect(() => {
    const getRevenueTypes = async () => {
      try {
        const res = await api.get("/revenue-types");

        const types = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setRevenueTypes(types);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load revenue types");
      }
    };

    getRevenueTypes();
  }, []);

  /* ================= HANDLE REVENUE CHANGE ================= */
  const handleRevenueChange = (e) => {
    const selectedId = e.target.value;

    setRevenueTypeId(selectedId);

    const revenue = revenueTypes.find(
      (r) => String(r.id) === selectedId
    );

    if (!revenue) {
      setSelectedRevenue(null);
      setAmount("");
      setPeriodOptions([]);
      setPeriodReference("");
      return;
    }

    setSelectedRevenue(revenue);
    setAmount(revenue.amount || revenue.defaultAmount || "");

    const now = new Date();
    let options = [];

    if (revenue.period === "yearly") {
      options = Array.from(
        { length: 5 },
        (_, i) => `${now.getFullYear() - i}`
      );
    } else if (revenue.period === "monthly") {
      options = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, "0");
        return `${now.getFullYear()}-${month}`;
      });
    } else if (revenue.period === "weekly") {
      options = Array.from({ length: 8 }, (_, i) => {
        const date = new Date();
        date.setDate(now.getDate() + i * 7);
        return date.toISOString().slice(0, 10);
      });
    }

    setPeriodOptions(options);
    setPeriodReference("");
  };

  /* ================= PAYSTACK ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!revenueTypeId) {
      toast.error("Please select revenue type");
      return;
    }

    if (!amount) {
      toast.error("Amount is required");
      return;
    }

    if (!periodReference) {
      toast.error("Please select period");
      return;
    }

    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const reference = `T${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

      email:
        user?.email ||
        "user@email.com",

      amount: Number(amount) * 100,

      currency: "NGN",

      ref: reference,

      callback: function (response) {
        recordPayment(response.reference);
      },

      onClose: function () {
        toast.info("Payment cancelled");
      },
    });

    handler.openIframe();
  };

  /* ================= RECORD PAYMENT ================= */
  const recordPayment = async (paystackReference) => {
    try {
      setLoading(true);

      const payload = {
        revenueTypeId,
        amount: Number(amount),
        periodReference,
        paymentGatewayReference:
          paystackReference,
        paymentGatewayProvider:
          "paystack",
      };

      console.log("TOKEN:");
      console.log(
        localStorage.getItem("token")
      );

      console.log("PAYLOAD:");
      console.log(payload);

      const res = await api.post(
        "/payments",
        payload
      );

      console.log(
        "PAYMENT RESPONSE:"
      );
      console.log(res.data);

      toast.success(
        "Payment successful and recorded"
      );

      setRevenueTypeId("");
      setAmount("");
      setPeriodReference("");
      setSelectedRevenue(null);
      setPeriodOptions([]);

      navigate("/dashboard");
    } catch (error) {
      console.log(
        "PAYMENT ERROR:"
      );

      console.log(error);

      console.log(
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row items-center justify-center gap-8 p-6">

      {/* FORM */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-[500px]">
        <p className="text-center py-3 font-bold text-xl">
          Make Payment
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <div>
            <label className="font-medium">
              Revenue Type
            </label>

            <select
              value={revenueTypeId}
              onChange={handleRevenueChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">
                Select Revenue Type
              </option>

              {revenueTypes.map((type) => (
                <option
                  key={type.id}
                  value={String(type.id)}
                >
                  {type.name} ({type.period})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">
              Amount
            </label>

            <input
              value={amount}
              disabled
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label className="font-medium">
              Period Reference
            </label>

            <select
              value={periodReference}
              onChange={(e) =>
                setPeriodReference(
                  e.target.value
                )
              }
              className="w-full border p-2 rounded-md"
            >
              <option value="">
                Select Period
              </option>

              {periodOptions.map((p, i) => (
                <option
                  key={i}
                  value={p}
                >
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={loading}
            className="bg-green-800 text-white p-2 rounded-md flex justify-center gap-2"
          >
            {loading
              ? "Processing..."
              : "Pay Now"}
          </button>

        </form>
      </div>

      {/* INFO */}
      <div className="max-w-md text-gray-700">
        <h2 className="text-xl font-bold mb-2">
          Payment Information
        </h2>

        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>Secure Paystack payment</li>
          <li>Instant receipt generation</li>
          <li>Automatically recorded in dashboard</li>
        </ul>

        <p className="mt-4 text-sm">
          View history →
          <Link
            className="text-green-700 ml-1"
            to="/history"
          >
            Payment History
          </Link>
        </p>
      </div>

    </div>
  );
};

export default MakePayment;