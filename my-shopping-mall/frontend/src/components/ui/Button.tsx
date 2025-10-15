interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "danger";
	type?: "button" | "submit" | "reset";
	className?: string;
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	disabled,
	variant = "primary",
	type = "button",
	className,
}) => {
	return (
		<button
			className={`px-4 py-2 rounded-md ${className} ${
				variant === "primary"
					? "bg-blue-500 text-white"
					: variant === "secondary"
					? "bg-gray-500 text-white"
					: "bg-red-500 text-white"
			}`}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
