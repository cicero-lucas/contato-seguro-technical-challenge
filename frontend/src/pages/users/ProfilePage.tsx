import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, KeyRound, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUpdateUser } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/formatters'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
})

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'As senhas não coincidem',
    path: ['confirm'],
  })

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const { user, setAuth, token } = useAuthStore()
  const { mutate: updateUser, isPending, error } = useUpdateUser()
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name, email: user.email })
  }, [user])

  const apiError = (error as AxiosError<ApiError>)?.response?.data?.message

  function handleProfileSubmit(data: ProfileData) {
    if (!user) return
    updateUser(
      { id: user.id, data },
      {
        onSuccess: (updated) => {
          setAuth(updated, token!)
          setProfileSuccess(true)
          setTimeout(() => setProfileSuccess(false), 3000)
        },
      }
    )
  }

  function handlePasswordSubmit(data: PasswordData) {
    if (!user) return
    updateUser(
      { id: user.id, data: { password: data.password } },
      {
        onSuccess: () => {
          passwordForm.reset()
          setPasswordSuccess(true)
          setTimeout(() => setPasswordSuccess(false), 3000)
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-500">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-xs text-gray-400 mt-1">Membro desde {formatDate(user.createdAt)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-gray-400" />
            <CardTitle>Informações Pessoais</CardTitle>
          </div>
          <CardDescription>Atualize seu nome e e-mail</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Perfil atualizado com sucesso!
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...profileForm.register('name')} />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-red-500">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...profileForm.register('email')} />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-red-500">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-gray-400" />
            <CardTitle>Alterar Senha</CardTitle>
          </div>
          <CardDescription>Escolha uma senha segura com no mínimo 6 caracteres</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Senha alterada com sucesso!
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" type="password" placeholder="••••••••" {...passwordForm.register('password')} />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-red-500">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input id="confirm" type="password" placeholder="••••••••" {...passwordForm.register('confirm')} />
              {passwordForm.formState.errors.confirm && (
                <p className="text-xs text-red-500">{passwordForm.formState.errors.confirm.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Alterar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
