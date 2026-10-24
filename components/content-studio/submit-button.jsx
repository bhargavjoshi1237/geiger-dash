'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@geiger/ui'

// Form submit carrying an `intent`; only the button that was pressed shows the spinner.
export function SubmitButton({ intent, variant = 'default', children, ...props }) {
  const { pending, data } = useFormStatus()
  const mine = pending && (!intent || data?.get('intent') === intent)

  return (
    <Button type="submit" name={intent ? 'intent' : undefined} value={intent} variant={variant} size="sm" disabled={pending} {...props}>
      {mine ? <Loader2 className="size-3.5 animate-spin" /> : null}
      {children}
    </Button>
  )
}
