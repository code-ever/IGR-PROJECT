import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdRadioButtonUnchecked } from "react-icons/md";

const MembersRecords = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // change if needed
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Toggle Active / Inactive
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await api.put(`/users/${id}`, { status: newStatus });

      // Update UI instantly
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Members Records</h2>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No members found
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>

                  {/* Status Column */}
                  <td className="p-3">
                    {user.status === "active" ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium">
                        <IoIosCheckmarkCircle size={20} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium">
                        <MdRadioButtonUnchecked size={20} />
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Toggle Button */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        toggleStatus(user._id, user.status)
                      }
                      className={`px-3 py-1 rounded text-white text-sm ${
                        user.status === "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {user.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MembersRecords;
