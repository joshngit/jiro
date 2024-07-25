import { cn } from '../../lib/cn'

interface Props {
  error?: string
  className?: string
}

export function ErrorMessage({ error, className }: Props) {
  if (!error) return

  return <p className={cn('text-red-500 text-sm', className)}>{error}</p>
}
