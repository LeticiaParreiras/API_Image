import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { registerSchema, type RegisterFormValues } from '../lib/schemas';
import { useRegister } from '../hooks/AuthMutation';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';


export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password') ?? '';
  const checks = [
    { label: '8-12 caracteres', ok: password.length >= 8 && password.length <= 12 },
    { label: '1 maiúscula', ok: /[A-Z]/.test(password) },
    { label: '1 minúscula', ok: /[a-z]/.test(password) },
    { label: '1 número', ok: /\d/.test(password) },
    { label: '1 símbolo', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = (data: RegisterFormValues) => {
    registerUser.mutate(data, {
      onSuccess: () => navigate('/login'),
    });
  };

  return (
    <AuthLayout
      eyebrow="Comece agora"
      title="Criar conta"
      subtitle="Publique fotos, siga pessoas e construa sua galeria."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:opacity-80">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
          <Input
            label='Username'
            type="text"
            autoComplete="username"
            error={errors.username?.message}
            placeholder="seu_usuario"
            {...register('username')}
          />
          <Input
            type="text"
            label='Nome'
            autoComplete="name"
            placeholder="seu nome"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            type="email"
            label='E-mail'
            autoComplete="email"
            placeholder="seu-email@exemplo.com"
            {...register('email')}
          />
            <Input
            type="password"
            label='Senha'
            error={errors.password?.message}
            autoComplete="new-password"
            placeholder="Sua senha"
            {...register('password')}
          />
  
          {password.length > 0 && (
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
              {checks.map((check) => (
                <li
                  key={check.label}
                  className={`font-mono text-[11px] transition-colors ${
                    check.ok ? 'text-pink-500' : 'text-neutral-600'
                  }`}
                >
                  {check.ok ? '✓' : '·'} {check.label}
                </li>
              ))}
            </ul>
          )}

        {registerUser.isError && (
  <p className="text-red-400">
    {registerUser.error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'}
  </p>
)}
        <Button
        variant='primary'
          type="submit"
          disabled={registerUser.isPending}
          className="w-full rounded-md bg-pink-500 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-pink-400 disabled:opacity-50"
        >
          {registerUser.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  );
}