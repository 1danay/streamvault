interface InputProps {
  label?: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const BaseInput = ({ label, type = "text", value, onChange, placeholder, required = true }: InputProps) => {
  return (
    <div className="mb-4 flex flex-col">
      {label && <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
      />
    </div>
  );
};

export default BaseInput;
