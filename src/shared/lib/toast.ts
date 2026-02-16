import { toast } from 'sonner'

const DURATION = 3000

export function showToast(message: string) {
  toast(message, {
    duration: DURATION,
    className: 'bg-primary-200/50 text-grey-900',
  })
}

export function showErrorToast(message: string) {
  toast.error(message, {
    duration: DURATION,
    className: 'bg-accent-200/50 text-accent-300',
  })
}
