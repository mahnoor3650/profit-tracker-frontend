// components/ProfitTable.jsx
import API from "../api";
import { useEffect, useState } from "react";

function getTypeLabel(type) {
  if (type === "profit") return "Profit";
  if (type === "loss") return "Loss";
  if (type === "withdrawal") return "Withdrawal";
  return "";
}

function getAmountClass(type) {
  if (type === "profit") return "text-green-600 font-bold";
  if (type === "loss") return "text-red-600 font-bold";
  if (type === "withdrawal") return "text-yellow-600 font-bold";
  return "";
}

export default function ProfitTable({ refreshFlag, onRefresh, latestRecord }) {
  const [profits, setProfits] = useState([]);

  useEffect(() => {
    API.get("/profits").then((res) => {
      const allRecords = res.data;
      const filtered = allRecords.filter((p) => p.type === "profit" || p.type === "loss");
      setProfits(filtered);
    });
  }, [refreshFlag]);

  const deleteLatestRecord = async () => {
    if (!latestRecord) return;
    
    try {
      await API.delete(`/profits/latest/${latestRecord.type}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting latest record:", error);
    }
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-700">
        Profit/Loss Records
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 rounded-lg text-sm sm:text-base">
          <thead className="bg-yellow-100">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left">Date</th>
              <th className="px-2 sm:px-4 py-2 text-left">Amount</th>
              <th className="px-2 sm:px-4 py-2 text-left">Type</th>
              <th className="px-2 sm:px-4 py-2 text-left">Balance Before</th>
              <th className="px-2 sm:px-4 py-2 text-left">Balance After</th>
              <th className="px-2 sm:px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profits.map((p, idx) => (
              <tr
                key={p._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-yellow-50"}
              >
                <td className="px-2 sm:px-4 py-2">
                  {new Date(p.date).toLocaleDateString()}
                </td>
                <td className={`px-2 sm:px-4 py-2 ${getAmountClass(p.type)}`}>
                  ${p.amount}
                </td>
                <td className={`px-2 sm:px-4 py-2 ${getAmountClass(p.type)}`}>
                  {getTypeLabel(p.type)}
                </td>
                <td className="px-2 sm:px-4 py-2">${p.balanceBefore ?? "-"}</td>
                <td className="px-2 sm:px-4 py-2">${p.balanceAfter ?? "-"}</td>
                <td className="px-2 sm:px-4 py-2">
                  {latestRecord && p._id === latestRecord._id && (p.type === "profit" || p.type === "loss") && (
                    <button
                      onClick={deleteLatestRecord}
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
