import React from "react";
import NothingFound from "../../../Components/Nothing/NothingFound";

export default function PaymentTab() {
  return (
    <div className="profile-content">
      <h2>Payment History</h2>
      <NothingFound
        imageSrc="/src/assets/sad_cloud.png"
        title="No payments yet"
        message="When you purchase services, your transactions will appear here."
      />
    </div>
  );
}
