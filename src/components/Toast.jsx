import { useEffect } from 'react'
import '../styles/Toast.css'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
    </div>
  )
}

export default Toast