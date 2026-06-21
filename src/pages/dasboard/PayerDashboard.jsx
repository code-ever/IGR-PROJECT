import React, { useEffect, useState } from "react";
import api from "../../services/api";

const PayerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/user");

        const payments = res.data?.data || [];

        const totalPaid = payments.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0
        );

        setUser({
          name: "Tax Payer",
          totalPaid,
        });

        setTransactions(payments);
      } catch (error) {
        console.error("Failed to load payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const latestPayment =
    recentTransactions.length > 0 ? recentTransactions[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-800 font-semibold animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-green-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm">
          IGR Payer Dashboard Overview
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 rounded-xl shadow">
          <p className="text-sm opacity-80">Total Paid</p>
          <h2 className="text-3xl font-bold mt-2">
            ₦{user?.totalPaid?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Transactions</p>
          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {transactions.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Latest Payment</p>
          <h2 className="text-2xl font-bold text-purple-700 mt-2">
            {latestPayment
              ? `₦${Number(latestPayment.amount).toLocaleString()}`
              : "₦0"}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Status</p>
          <h2 className="text-2xl font-bold text-green-700 mt-2">
            Active
          </h2>
        </div>

      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="mt-8 md:hidden space-y-4">
        <h2 className="font-bold text-gray-700">Recent Transactions</h2>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">
                  {tx.revenueType?.name}
                </p>

                <span className="text-green-700 font-bold">
                  ₦{Number(tx.amount).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Period: {tx.periodReference}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(tx.createdAt).toLocaleDateString()}
              </p>

              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                Paid
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No transactions found</p>
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="mt-8 hidden md:block bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Recent Transactions
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-3">Revenue Type</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Date Paid</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  {tx.revenueType?.name}
                </td>

                <td className="font-semibold text-green-700">
                  ₦{Number(tx.amount).toLocaleString()}
                </td>

                <td>{tx.periodReference}</td>

                <td>
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Paid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default PayerDashboard;