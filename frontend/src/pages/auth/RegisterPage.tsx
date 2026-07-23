import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { HeadphonesIcon, Loader2 } from 'lucide-react'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/dashboard')
    },
  })

  const apiError = (error as AxiosError<ApiError>)?.response?.data?.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 mb-4">
            <HeadphonesIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Triagem API</h1>
          <p className="text-sm text-gray-500">Sistema de triagem de atendimentos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
              {apiError && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar conta
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
