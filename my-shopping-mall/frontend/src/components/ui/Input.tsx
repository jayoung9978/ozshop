interface InputProps {
	type?: "text" | "email" | "password" | "number" | "tel";
	name?: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	error?: string;
	label?: string;
	className?: string;
	required?: boolean;
}

const Input: React.FC<InputProps> = ({
	type = "text",
	name,
	placeholder,
	value,
	onChange,
	disabled,
	error,
	label,
	className,
	required,
}) => {
	return (
		<div className="mb-4">
			{label && (
				<label className="block text-gray-700 text-sm font-medium mb-2">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					error ? "border-red-500" : "border-gray-300"
				} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
};

export default Input;
