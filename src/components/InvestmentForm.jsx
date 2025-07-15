// components/InvestmentForm.jsx
import { useEffect, useState } from "react";
import API from "../api";

export default function InvestmentForm({ onSet }) {
  const [amount, setAmount] = useState("");
  const [existing, setExisting] = useState(null);
  const [original, setOriginal] = useState("");

  useEffect(() => {
    API.get("/investment").then((res) => {
      if (res.data) {
        setAmount(res.data.amount);
        setOriginal(res.data.amount);
        setExisting(true);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/investment", { amount: parseFloat(amount) });
    alert("Investment saved");
    setOriginal(amount);
    setExisting(true);
    if (onSet) onSet();
  };

  const isUnchanged = amount === "" || parseFloat(amount) === parseFloat(original);
  const isDisabled = existing;

  if (existing) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-blue-700">
        Set Initial Investment
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-3 items-stretch sm:items-center w-full">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Initial Amount"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto text-base"
        />
        <button
          type="submit"
          disabled={isUnchanged}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto disabled:opacity-60"
        >
          Save
        </button>
      </form>
    </div>
  );
}
