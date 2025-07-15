// components/Summary.jsx
import { useEffect, useState } from "react";
import API from "../api";

export default function Summary({ refreshFlag }) {
  const [investment, setInvestment] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const inv = await API.get("/investment");
      const profits = await API.get("/profits");
      setInvestment(inv.data?.amount || 0);
      let withdrawal = 0;
      let net = 0;
      profits.data.forEach((p) => {
        if (p.type === "withdrawal") withdrawal += p.amount;
        else net += p.amount;
      });
      setTotalWithdrawal(withdrawal);
      setBalance((inv.data?.amount || 0) + net + withdrawal);
    };
    fetchData();
  }, [refreshFlag]);

  return (
    <div className="bg-purple-50 rounded-lg p-3 sm:p-4 shadow mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-purple-700 mb-1">Summary</h2>
        <p className="text-gray-700 text-base sm:text-lg">Initial Investment: <span className="font-bold">${investment}</span></p>
        <p className="text-yellow-700 text-base sm:text-lg">Total Withdrawn: <span className="font-bold">${Math.abs(totalWithdrawal)}</span></p>
      </div>
      <div className="text-center w-full sm:w-auto">
        <p className="text-base sm:text-lg font-bold text-white bg-purple-600 rounded px-2 sm:px-4 py-2 shadow whitespace-nowrap">Current Balance: ${balance}</p>
      </div>
    </div>
  );
}
