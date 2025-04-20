import { useState, useEffect, createContext, useContext } from "react"


const ToastContext = createContext()


const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING:"warning"
}

const TOAST_POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
}

const Toast = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 3000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const toastStyles = {
    backgroundColor: ((type === "success") && "#4caf50") || ((type === "error") && "#f44336") || ((type === "warning") && "#f7a50e"),
    color: "white",
    padding: "12px 16px",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    minWidth: "300px",
    maxWidth: "400px",
    animation: "slideIn 0.3s ease-out forwards",
    position: "relative",
    overflow: "hidden",
  }

  const iconStyles = {
    marginRight: "12px",
    fontSize: "20px",
  }

  const contentStyles = {
    flex: 1,
  }

  const closeButtonStyles = {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginLeft: "10px",
    padding: "0 5px",
  }

  const progressBarStyles = {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "3px",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    animation: "shrink 3s linear forwards",
    width: "100%",
  }

  return (
    <div style={toastStyles}>
      <div style={iconStyles}>{((type === "success") && "✓") || ((type === "error") && "✕") || ((type === "warning") && "⚠️") }</div>
      <div style={contentStyles}>{message}</div>
      <button style={closeButtonStyles} onClick={() => onClose(id)}>
        ×
      </button>
      <div style={progressBarStyles}></div>
    </div>
  )
}

const ToastContainer = ({ position = TOAST_POSITIONS.TOP_RIGHT }) => {
  const { toasts } = useContext(ToastContext)

  const getPositionStyles = () => {
    switch (position) {
      case TOAST_POSITIONS.TOP_LEFT:
        return { top: "20px", left: "20px" }
      case TOAST_POSITIONS.BOTTOM_RIGHT:
        return { bottom: "20px", right: "20px" }
      case TOAST_POSITIONS.BOTTOM_LEFT:
        return { bottom: "20px", left: "20px" }
      case TOAST_POSITIONS.TOP_RIGHT:
      default:
        return { top: "20px", right: "20px" }
    }
  }

  const containerStyles = {
    position: "fixed",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    ...getPositionStyles(),
  }

  return (
    <div style={containerStyles}>
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} type={toast.type} message={toast.message} onClose={toast.onClose} />
      ))}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const addToast = (type, message) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        type,
        message,
        onClose: removeToast,
      },
    ])
    return id
  }

  const showSuccess = (message) => {
    return addToast(TOAST_TYPES.SUCCESS, message)
  }

  const showError = (message) => {
    return addToast(TOAST_TYPES.ERROR, message)
  }

  const showWarning = (message) => {
    return addToast(TOAST_TYPES.WARNING, message)
  }

  const value = {
    toasts,
    showSuccess,
    showError,
    showWarning
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const CustomPositionToastContainer = ({ position }) => {
  return <ToastContainer position={position} />
}