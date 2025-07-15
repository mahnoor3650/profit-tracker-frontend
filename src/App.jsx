// App.jsx
import { useState, useEffect } from "react";
import InvestmentForm from "./components/InvestmentForm";
import ProfitForm from "./components/ProfitForm";
import ProfitTable from "./components/ProfitTable";
import Summary from "./components/Summary";
import WithdrawForm from "./components/WithdrawForm";
import WithdrawalsTable from "./components/WithdrawalsTable";
import API from "./api";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  const refresh = () => setRefreshFlag((prev) => !prev);

  useEffect(() => {
    const fetchBalance = async () => {
      const inv = await API.get("/investment");
      const profits = await API.get("/profits");
      let withdrawal = 0;
      let net = 0;
      profits.data.forEach((p) => {
        if (p.type === "withdrawal") withdrawal += p.amount;
        else net += p.amount;
      });
      setCurrentBalance((inv.data?.amount || 0) + net + withdrawal);
    };
    fetchBalance();
  }, [refreshFlag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-4 px-1 sm:py-8 sm:px-2">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-2 sm:p-6 space-y-4 sm:space-y-6 mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-700 mb-2">
          📊 Profit Tracker App
        </h1>
        <Summary refreshFlag={refreshFlag} />
        <InvestmentForm onSet={refresh} />
        <ProfitForm onAdd={refresh} currentBalance={currentBalance} />
        <ProfitTable refreshFlag={refreshFlag} />
        <WithdrawForm onWithdraw={refresh} currentBalance={currentBalance} />
        <WithdrawalsTable refreshFlag={refreshFlag} />
      </div>
    </div>
  );
}

export default App;
