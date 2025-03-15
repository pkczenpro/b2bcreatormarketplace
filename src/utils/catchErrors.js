import { toast, Toaster } from "sonner";

class ApiErrorHandler {
    static handle(error) {
        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error.response) {
            // Server responded with an error
            console.error("API Error:", error.response.data);
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
        } else if (error.request) {
            // No response received
            console.error("No response from server:", error.request);
            errorMessage = "No response from the server. Please check your internet connection.";
        } else {
            // Request setup error
            console.error("Request error:", error.message);
            errorMessage = "Request setup failed. Please try again.";
        }

        // Show toast notification
        toast.error(errorMessage, {
            position: "top-center",
        });
        return errorMessage;
    }
}

export default ApiErrorHandler;
