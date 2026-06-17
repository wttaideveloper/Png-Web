import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AdminToast({ message, type = "success", onClose }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <AnimatePresence>
      <motion.div
        className={`admin-toast ${isError ? "admin-toast-error" : "admin-toast-success"}`}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        role="status"
      >
        {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
        <span>{message}</span>
        {onClose ? (
          <button type="button" className="admin-toast-close" onClick={onClose} aria-label="Dismiss">
            <X size={16} />
          </button>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
