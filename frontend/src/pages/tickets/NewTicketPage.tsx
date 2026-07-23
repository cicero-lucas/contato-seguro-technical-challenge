import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { useCreateTicket } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

const schema = z.object({
  message: z.string().min(5, 'Mensagem deve ter no mínimo 5 caracteres').max(1000, 'Máximo de 1000 caracteres'),
})

type FormData = z.infer<typeof schema>

export function NewTicketPage() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useCreateTicket()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const messageLength = watch('message')?.length ?? 0
  const apiError = (error as AxiosError<ApiError>)?.response?.data?.message

  function onSubmit(data: FormData) {
    mutate(data, {
      onSuccess: (ticket) => navigate(`/tickets/${ticket.id}`),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/tickets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Ticket</h1>
          <p className="text-sm text-gray-500">O canal será classificado automaticamente por IA</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>Classificação Automática</CardTitle>
          </div>
          <CardDescription>
            Descreva o problema com detalhes. Nossa IA irá classificar automaticamente
            o ticket no canal correto: Ouvidoria, SAC, Suporte Técnico, Financeiro ou Fora do Escopo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Mensagem</Label>
                <span className="text-xs text-gray-400">{messageLength}/1000</span>
              </div>
              <Textarea
                id="message"
                placeholder="Descreva detalhadamente o seu problema ou solicitação..."
                className="min-h-[160px]"
                {...register('message')}
              />
              {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" asChild>
                <Link to="/tickets">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Classificando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Criar Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
