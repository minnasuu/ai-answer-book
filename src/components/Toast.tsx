import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-gray-800/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}
