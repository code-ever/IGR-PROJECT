import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Revenue = () => {
  const [revenueTypes, setRevenueTypes] = useState([]);
  const [newRevenue, setNewRevenue] = useState({
    name: "",
    description: "",
    amount: "",
    period: "daily",
  });
  const [editRevenue, setEditRevenue] = useState(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ================= FETCH =================
  const fetchRevenueTypes = async () => {
    try {
      setTableLoading(true);
      const res = await api.get("/revenue-types");
      setRevenueTypes(
        Array.isArray(res.data) ? res.data : res.data?.data || []
      );
    } catch (err) {
      toast.error("Failed to fetch revenue types");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueTypes();
  }, []);

  // ================= CREATE =================
  const handleCreateRevenue = async () => {
    if (!newRevenue.name || !newRevenue.amount) {
      toast.warning("Name and Amount are required");
      return;
    }

    const payload = {
      ...newRevenue,
      amount: parseInt(newRevenue.amount, 10),
    };

    if (payload.amount < 1 || isNaN(payload.amount)) {
      toast.error("Amount must be a number greater than 0");
      return;
    }

    try {
      setCreateLoading(true);
      await api.post("/revenue-types", payload);
      toast.success("Revenue type created successfully 🎉");
      setNewRevenue({
        name: "",
        description: "",
        amount: "",
        period: "daily",
      });
      fetchRevenueTypes();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create revenue type"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // ================= UPDATE =================
  const openEditModal = (rev) => setEditRevenue({ ...rev });

  const handleUpdateRevenue = async () => {
    if (!editRevenue.name || !editRevenue.amount) {
      toast.warning("Name and Amount are required");
      return;
    }

    const payload = {
      name: editRevenue.name,
      description: editRevenue.description,
      period: editRevenue.period,
      amount: parseInt(editRevenue.amount, 10),
    };

    if (payload.amount < 1 || isNaN(payload.amount)) {
      toast.error("Amount must be a number greater than 0");
      return;
    }

    try {
      setUpdateLoading(true);
      await api.put(`/revenue-types/${editRevenue.id}`, payload);
      toast.success("Revenue type updated successfully ✅");
      setEditRevenue(null);
      fetchRevenueTypes();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update revenue type"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteRevenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this revenue type?"))
      return;

    try {
      setDeleteLoading(id);
      await api.delete(`/revenue-types/${id}`);
      toast.success("Revenue type deleted successfully 🗑️");
      fetchRevenueTypes();
    } catch (err) {
      toast.error("Failed to delete revenue type");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ===== Create Revenue Type ===== */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Create Revenue Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newRevenue.name}
            onChange={(e) =>
              setNewRevenue({ ...newRevenue, name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Description"
            value={newRevenue.description}
            onChange={(e) =>
              setNewRevenue({
                ...newRevenue,
                description: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={newRevenue.amount}
            onChange={(e) =>
              setNewRevenue({ ...newRevenue, amount: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={newRevenue.period}
            onChange={(e) =>
              setNewRevenue({ ...newRevenue, period: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button
            onClick={handleCreateRevenue}
            disabled={createLoading}
            className={`px-4 py-2 rounded mt-2 md:mt-0 text-white transition ${
              createLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {createLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* ===== Revenue Types Table ===== */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Revenue Types</h2>

        {tableLoading ? (
          <div className="text-center py-6 text-gray-500">
            Loading...
          </div>
        ) : revenueTypes.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            No revenue types found
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Period</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {revenueTypes.map((rev) => (
                <tr key={rev.id} className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <FiPlus className="text-gray-500" />
                    {rev.name}
                  </td>
                  <td className="p-3">{rev.description}</td>
                  <td className="p-3">
                    ₦{Number(rev.amount).toLocaleString()}
                  </td>
                  <td className="p-3 capitalize">{rev.period}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(rev)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteRevenue(rev.id)}
                      disabled={deleteLoading === rev.id}
                      className="text-red-600 hover:text-red-800"
                    >
                      {deleteLoading === rev.id ? "Deleting..." : <FiTrash2 size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== Edit Modal ===== */}
      {editRevenue && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Edit Revenue Type
            </h2>

            <input
              type="text"
              value={editRevenue.name}
              onChange={(e) =>
                setEditRevenue({
                  ...editRevenue,
                  name: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="text"
              value={editRevenue.description}
              onChange={(e) =>
                setEditRevenue({
                  ...editRevenue,
                  description: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />

            <input
              type="number"
              value={editRevenue.amount}
              onChange={(e) =>
                setEditRevenue({
                  ...editRevenue,
                  amount: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />

            <select
              value={editRevenue.period}
              onChange={(e) =>
                setEditRevenue({
                  ...editRevenue,
                  period: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-4"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditRevenue(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateRevenue}
                disabled={updateLoading}
                className={`px-4 py-2 rounded text-white ${
                  updateLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600"
                }`}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
