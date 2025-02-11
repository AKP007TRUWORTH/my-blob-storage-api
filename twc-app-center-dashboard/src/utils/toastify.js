import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define severity levels similar to `toastSeverity` in `@truworth/components`
export const toastSeverity = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};

/**
 * Show toast notification
 * @param {string} message - Message to display in the toast
 * @param {"success" | "error" | "warning" | "info"} severity - Severity level (success, error, warning, info)
 */


const toastStyles = {
    success: {
        backgroundColor: "#28a745", // ✅ Green
        color: "#fff",
    },
    error: {
        backgroundColor: "#dc3545", // ❌ Red
        color: "#fff",
    },
    warning: {
        backgroundColor: "#ffc107", // ⚠️ Yellow
        color: "#000",
    },
    info: {
        backgroundColor: "#17a2b8", // ℹ️ Blue
        color: "#fff",
    },
};

export const showToast = (message, severity = toastSeverity.INFO) => {
    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progressStyle: { background: "#ffffff" },
        theme: "colored",
        draggable: true,
        style: toastStyles[severity] || toastStyles.info, // ✅ Apply custom background color
    };
    switch (severity) {
        case toastSeverity.SUCCESS:
            toast.success(message, toastOptions);
            break;
        case toastSeverity.ERROR:
            toast.error(message, toastOptions);
            break;
        case toastSeverity.WARNING:
            toast.warning(message, toastOptions);

            break;
        case toastSeverity.INFO:
        default:
            toast.info(message, toastOptions);
            break;
    }
};