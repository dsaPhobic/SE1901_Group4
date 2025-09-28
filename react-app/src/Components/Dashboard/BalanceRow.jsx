import React from "react";
import BalanceCard from "./BalanceCard";
import EnjoyCard from "./EnjoyCard";

export default function BalanceRow() {
  return (
    <div className="balance-wrapper">
      <BalanceCard />
      <EnjoyCard />
    </div>
  );
}
