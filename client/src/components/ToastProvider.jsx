import { Toaster } from "react-hot-toast";
const ToastProvider = () => (
	<Toaster
		position="bottom-right"
		toastOptions={{
			duration: 2800,
			style: {
				background: "var(--vanta-surface)",
				color: "var(--vanta-text)",
				border: "1px solid var(--vanta-border)",
			},
		}}
	/>
);
export default ToastProvider;
