import { useState } from "react";

function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Selecione uma opção",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOpition = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border border-brand-green-lime rounded-lg px-4 py-2 flex items-center justify-between text-brand-graphite focus:outline-none transition-colors">
        <div className="flex items-center justify-between">
          <span> {selectedOpition ? selectedOpition.label : placeholder} </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value
                  ? "bg-brand-green-lime text-brand-graphite font-medium"
                  : "text-gray-700"
              }`}
            >{option.label}</button>
          ))}
        </div>
      )}


      {isOpen && (
        <div className="fixed inset-0  z-0" onClick={() => setIsOpen(false)}> </div>
      )}

    </div>
  );
}

export default Dropdown