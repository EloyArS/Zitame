import React from "react";
//Usado en Booking, Login, Dashboard y Services para los campos de formulario.
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
      <label className="block text-gray-700 text-sm font-bold mb-5 dark:text-white">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
    </div>
  );
};

export default InputField;
