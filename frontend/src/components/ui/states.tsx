import { Loader2, InboxIcon } from 'lucide-react'

export function LoadingSpinner({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <InboxIcon className="h-10 w-10" />
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  )
}

export function ErrorState({ message = 'Erro ao carregar dados.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <p className="text-sm text-red-500">{message}</p>
    </div>
  )
}
