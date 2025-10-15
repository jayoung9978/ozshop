interface ErrorMessageProps {
	title?: string;
	message: string;
	onRetry?: () => void;
	fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	title = "오류가 발생했습니다",
	message,
	onRetry,
	fullScreen = false,
}) => {
	const content = (
		<div className="text-center">
			<div className="text-red-500 text-5xl mb-4">⚠️</div>
			<h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
			<p className="text-gray-600 mb-4">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					다시 시도
				</button>
			)}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				{content}
			</div>
		);
	}

	return content;
};

export default ErrorMessage;
