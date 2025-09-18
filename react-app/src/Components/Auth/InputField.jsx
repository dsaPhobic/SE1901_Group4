import React from "react";
import "./InputField.css";

const InputField = (props) => {
  return (
    <div className="ifield">
      <span className="ifield__icon">{props.icon}</span>
      <span className="ifield__label">{props.label}</span>
    </div>
  );
};

export default InputField;
