export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  register, 
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...(register ? register(name) : {})}
        className={`
          w-full px-3 py-2 text-sm rounded-lg border
          bg-white text-gray-900 placeholder-gray-400
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 hover:border-gray-400"
          }
          ${className}
        `}
      />

      {/* Inline error message */}
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}