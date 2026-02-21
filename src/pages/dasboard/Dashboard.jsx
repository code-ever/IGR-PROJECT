import React, { useEffect, useState, useMemo } from "react";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaReceipt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  // ✅ Safer role detection
  const isAuditor =
    user?.role?.toLowerCase?.() === "auditor" ||
    user?.role?.name === "auditor";

  const [payments, setPayments] = useState( [] );
  const [status, setStatus] = useState( "" );

  const getTransaction = async () => {
    try {
      console.log( "LOGGED USER:", user );

      // ✅ CRITICAL FIX — auditor gets ALL payments
      const endpoint = isAuditor ? "/payments" : "/payments/user";

      const res = await api.get( endpoint );

      console.log( "PAYMENTS RESPONSE:", res.data );

      const data = Array.isArray( res.data )
        ? res.data
        : res.data?.data || [];

      setPayments( data );
      setStatus( res.data.status );
    } catch ( error ) {
      console.error( "Failed to fetch payments:", error );
    }
  };

  useEffect( () => {
    if ( user ) getTransaction(); // prevents undefined user bug
  }, [user] );

  const totalRevenue = useMemo(
    () => payments.reduce( ( sum, item ) => sum + Number( item.amount || 0 ), 0 ),
    [payments]
  );

  const todayRevenue = useMemo( () => {
    const today = new Date().toISOString().slice( 0, 10 );

    return payments
      .filter( ( p ) => p.createdAt?.slice( 0, 10 ) === today )
      .reduce( ( sum, item ) => sum + Number( item.amount || 0 ), 0 );
  }, [payments] );

  const monthRevenue = useMemo( () => {
    const thisMonth = new Date().toISOString().slice( 0, 7 );

    return payments
      .filter( ( p ) => p.createdAt?.slice( 0, 7 ) === thisMonth )
      .reduce( ( sum, item ) => sum + Number( item.amount || 0 ), 0 );
  }, [payments] );

  const yearRevenue = useMemo( () => {
    const thisYear = new Date().toISOString().slice( 0, 4 );

    return payments
      .filter( ( p ) => p.createdAt?.slice( 0, 4 ) === thisYear )
      .reduce( ( sum, item ) => sum + Number( item.amount || 0 ), 0 );
  }, [payments] );

  const formatCurrency = ( value ) =>
    `₦${Number( value ).toLocaleString()}`;

  /* Monthly Chart (Normal Users) */
  const chartData = useMemo( () => {
    const grouped = {};

    payments.forEach( ( p ) => {
      const month = p.createdAt?.slice( 0, 7 );
      if ( !month ) return;

      grouped[month] = ( grouped[month] || 0 ) + Number( p.amount || 0 );
    } );

    return Object.entries( grouped ).map( ( [month, amount] ) => ( {
      month,
      amount,
    } ) );
  }, [payments] );

  /* Auditor Chart (Revenue Sources) */
  const auditorChartData = useMemo( () => {
    const revenueMap = {};

    payments.forEach( ( p ) => {
      const type = p.revenueType?.name || "Other";

      revenueMap[type] = ( revenueMap[type] || 0 ) + Number( p.amount || 0 );
    } );

    return Object.entries( revenueMap ).map( ( [name, amount] ) => ( {
      name,
      amount,
    } ) );
  }, [payments] );

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Internal Generated Revenue Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Overview of revenue performance and transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isAuditor ? (
          <>
            <Card
              title="Total Payments"
              amount={formatCurrency( totalRevenue )}
              icon={<FaMoneyBillWave />}
              color="bg-green-600"
            />
            <Card
              title="Payments This Year"
              amount={formatCurrency( yearRevenue )}
              icon={<FaChartLine />}
              color="bg-blue-600"
            />
            <Card
              title="Payments This Month"
              amount={formatCurrency( monthRevenue )}
              icon={<FaReceipt />}
              color="bg-purple-600"
            />
            <Card
              title="Total Transactions"
              amount={payments.length}
              icon={<FaUsers />}
              color="bg-orange-500"
            />
          </>
        ) : (
          <>
            <Card
              title="Total Revenue"
              amount={formatCurrency( totalRevenue )}
              icon={<FaMoneyBillWave />}
              color="bg-green-600"
            />
            <Card
              title="Today's Revenue"
              amount={formatCurrency( todayRevenue )}
              icon={<FaChartLine />}
              color="bg-blue-600"
            />
            <Card
              title="This Month"
              amount={formatCurrency( monthRevenue )}
              icon={<FaReceipt />}
              color="bg-purple-600"
            />
            <Card
              title="Total Transactions"
              amount={payments.length}
              icon={<FaUsers />}
              color="bg-orange-500"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {isAuditor
            ? "Highest Generated Revenue Sources"
            : "Revenue Overview (Monthly)"}
        </h2>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={isAuditor ? auditorChartData : chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={isAuditor ? "name" : "month"} />
              <YAxis />
              <Tooltip formatter={( value ) => formatCurrency( value )} />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      {/* <div className="bg-white p-4 md:p-6 rounded-xl shadow-md overflow-x-scroll">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Transactions
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3">Txn Ref</th>
                <th className="p-3">Revenue Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.slice(0, 10).map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">
                    {item.paymentGatewayReference || "N/A"}
                  </td>
                  <td className="p-3">
                    {item.revenueType?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {item.status || "success"}
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>

          <Link
            to="/history"
            className="text-sm text-green-700 font-semibold hover:underline"
          >
            View More
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {payments.slice( 0, 3 ).map( ( item ) => (
            <div
              key={item.id}
              className="border rounded-xl p-3 hover:bg-gray-50 transition"
            >
              {/* TOP ROW */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.revenueType?.name || "Payment"}
                </p>

                <p className="text-base font-bold text-gray-900">
                  {formatCurrency( item.amount )}
                </p>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500 truncate">
                  Ref: {item.paymentGatewayReference || "N/A"}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${item.status === "success" || item.status === "RECONCILED"
                      ? "bg-green-100 text-green-700"
                      : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                  {item.status || "success"}
                </span>
              </div>

              {/* DATE */}
              <p className="text-xs text-gray-400 mt-1">
                {new Date( item.createdAt ).toLocaleString()}
              </p>
            </div>
          ) )}

          {payments.length === 0 && (
            <div className="text-center text-gray-400 py-6">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ( { title, amount, icon, color } ) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
    <div>
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{amount}</h3>
    </div>
    <div className={`${color} text-white p-3 rounded-full text-xl`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
