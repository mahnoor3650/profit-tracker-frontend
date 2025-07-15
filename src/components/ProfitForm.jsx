// components/ProfitForm.jsx
import { useState } from "react";
import API from "../api";

export default function ProfitForm({ onAdd, currentBalance }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    await API.post("/profits", {
      amount: amt,
      date,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance + amt,
    });
    onAdd(); // trigger parent to refresh
    setAmount("");
    setDate("");
  };

  const isInvalid = !amount || !date || parseFloat(amount) === 0;

  return (
    <div className="bg-green-50 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-green-700">Add Weekly Profit/Loss</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-3 items-stretch sm:items-center w-full">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Profit/Loss Amount"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-auto text-base"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full sm:w-auto text-base"
        />
        <button type="submit" disabled={isInvalid} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto disabled:opacity-60">Add</button>
      </form>
      <p className="text-xs text-gray-500 mt-1">Enter positive values for profits and negative values for losses.</p>
    </div>
  );
}
