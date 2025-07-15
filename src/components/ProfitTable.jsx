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

export default function ProfitTable({ refreshFlag }) {
  const [profits, setProfits] = useState([]);

  useEffect(() => {
    API.get("/profits").then((res) => setProfits(res.data));
  }, [refreshFlag]);

  // Only show profit/loss, not withdrawals
  const filtered = profits.filter((p) => p.type === "profit" || p.type === "loss");

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
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
