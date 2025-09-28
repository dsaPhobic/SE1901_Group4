import React from "react";

export default function BalanceCard() {
  return (
    <section className="balance-section">
      <h3>Account Balance</h3>

      <div className="balance-content">
        <div className="user-avatars">
          {["Ann", "Monica", "John", "Mike", "Mia"].map((name) => (
            <div key={name} className="avatar-item">
              {/* thay img thật nếu có */}
              <img
                alt={name}
                className="avatar"
                src={`/${name.toLowerCase()}.jpg`}
              />
              <span>{name}</span>
            </div>
          ))}
          <div className="avatar-item">
            <div className="avatar add">+</div>
            <span>Add New</span>
          </div>
        </div>

        <div className="balance-input-section">
          <input className="balance-input" value="1997" readOnly />
          <button className="transfer-button">Send the transfer</button>
        </div>
      </div>
    </section>
  );
}
