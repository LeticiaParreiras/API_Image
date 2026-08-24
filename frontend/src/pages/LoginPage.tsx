import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { loginSchema, type LoginFormValues } from '../lib/schemas';
import { useLogin } from '../hooks/AuthMutation';


export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <AuthLayout
      eyebrow="Bem-vindo de volta"
      title="Entrar"
      subtitle="Acesse sua conta para ver seu feed e continuar publicando."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-pink-500 hover:text-pink-400">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <input
            type="email"
            autoComplete="email"
            placeholder="email"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="senha"
            {...register('password')}
          />
          {errors.password?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
          )}
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="font-mono text-xs text-neutral-500 hover:text-pink-500"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {login.isError && (
  <p className="text-red-400">
    {login.error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'}
  </p>
)}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-pink-500 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-pink-400 disabled:opacity-50"
        >
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}