import React from "react";

function Input({ type, placeholder, value, onChange }) {
  return (
    <input
      className="w-3/5 border-2 border-gray-400 p-2 rounded-lg placeholder:text-sm"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default Input;
