import React from "react"
import { ToastProvider } from "./use-toast"

export function Toaster({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}
