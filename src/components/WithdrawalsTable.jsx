// components/WithdrawalsTable.jsx
import { useEffect, useState } from "react";
import API from "../api";

export default function WithdrawalsTable({ refreshFlag, onRefresh, latestRecord }) {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    API.get("/profits").then((res) => {
      const allRecords = res.data;
      const filtered = allRecords.filter((p) => p.type === "withdrawal");
      setWithdrawals(filtered);
    });
  }, [refreshFlag]);

  const deleteLatestWithdrawal = async () => {
    if (!latestRecord) return;
    
    try {
      await API.delete(`/profits/latest/withdrawal`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting latest withdrawal:", error);
    }
  };

  return (
    <div className="bg-orange-100 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-orange-700">Withdrawals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg text-sm sm:text-base">
          <thead className="bg-orange-200">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left">Date</th>
              <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
              <th className="px-2 sm:px-4 py-2 text-left">Balance Before</th>
              <th className="px-2 sm:px-4 py-2 text-left">Balance After</th>
              <th className="px-2 sm:px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w, idx) => (
              <tr key={w._id} className={idx % 2 === 0 ? "bg-white" : "bg-orange-50"}>
                <td className="px-2 sm:px-4 py-2">{new Date(w.date).toLocaleDateString()}</td>
                <td className="px-2 sm:px-4 py-2 text-orange-700 font-bold">${Math.abs(w.amount)}</td>
                <td className="px-2 sm:px-4 py-2">${w.balanceBefore ?? "-"}</td>
                <td className="px-2 sm:px-4 py-2">${w.balanceAfter ?? "-"}</td>
                <td className="px-2 sm:px-4 py-2">
                  {latestRecord && w._id === latestRecord._id && w.type === "withdrawal" && (
                    <button
                      onClick={deleteLatestWithdrawal}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 