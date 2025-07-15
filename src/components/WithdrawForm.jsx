// components/WithdrawForm.jsx
import { useState } from "react";
import API from "../api";

export default function WithdrawForm({ onWithdraw, currentBalance }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError("");
    const amt = Math.abs(parseFloat(amount));
    if (amt > currentBalance) {
      setError("Withdraw amount cannot exceed current balance.");
      return;
    }
    setLoading(true);
    await API.post("/profits/withdrawal", {
      amount: -amt,
      date,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance - amt,
    });
    setLoading(false);
    setAmount("");
    setDate("");
    onWithdraw();
  };

  const isInvalid = !amount || !date || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance;

  return (
    <div className="bg-purple-100 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-purple-700">Withdraw Amount</h2>
      <form onSubmit={handleWithdraw} className="flex flex-col gap-2 sm:flex-row sm:gap-3 items-stretch sm:items-center w-full">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Withdraw Amount"
          required
          max={currentBalance}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-32 sm:w-auto text-base"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto text-base"
        />
        <button type="submit" disabled={loading || isInvalid} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition w-full sm:w-auto disabled:opacity-60">{loading ? "Withdrawing..." : "Withdraw"}</button>
      </form>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">Current Balance: ${currentBalance}</p>
    </div>
  );
} 