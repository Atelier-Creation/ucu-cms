"use client";

import * as React from "react";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-[9999]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(100 - (elapsed / duration) * 100, 0);
      setProgress(pct);
      if (pct === 0) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative rounded-lg px-4 py-3 shadow-lg border text-sm w-80 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right fade-in
        ${
          toast.variant === "destructive"
            ? "bg-destructive text-destructive-foreground border-destructive"
            : toast.variant === "success"
            ? "bg-green-600 text-white border-green-700"
            : toast.variant === "error"
            ? "bg-background/90 text-gray-800 border-red-100"
            : "bg-background/90 text-foreground border-border"
        }`}
    >
      <strong className="block font-semibold">{toast.title}</strong>
      {toast.description && (
        <p className="text-sm opacity-90 mt-1">{toast.description}</p>
      )}

      {/* Progress bar at bottom */}
      <div className={`absolute bottom-0 left-0 h-[3px] bg-primary ${toast.variant === "destructive" ? "bg-destructive" : toast.variant === "success" ?"bg-white" : toast.variant === "error" ? "bg-red-600" : "bg-background/90 text-foreground border-border" } transition-all duration-100 linear`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast } = context;

  const toast = useCallback(
    ({ title, description, variant }) => {
      addToast({ title, description, variant });
    },
    [addToast]
  );

  return { toast };
}
