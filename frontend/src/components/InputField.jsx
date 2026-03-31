import React from "react";

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  min,
}) => {
  return (
    <div className="mb-4 text-left">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  );
};

export default InputField;
