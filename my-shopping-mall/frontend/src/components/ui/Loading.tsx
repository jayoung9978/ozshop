interface LoadingProps {
	size?: "sm" | "md" | "lg";
	text?: string;
	fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
	size = "md",
	text = "로딩 중...",
	fullScreen = false,
}) => {
	const sizeClasses = {
		sm: "w-8 h-8 border-2",
		md: "w-16 h-16 border-4",
		lg: "w-24 h-24 border-4",
	};

	const spinner = (
		<div className="text-center">
			<div
				className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
			></div>
			{text && <p className="text-gray-600">{text}</p>}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				{spinner}
			</div>
		);
	}

	return spinner;
};

export default Loading;
