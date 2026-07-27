import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" role="presentation">
      <section
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">{title}</h2>
          <Button aria-label="Close modal" className="h-9 min-h-9 px-2" onClick={onClose} variant="ghost">
            <X aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </section>
    </div>
  )
}
