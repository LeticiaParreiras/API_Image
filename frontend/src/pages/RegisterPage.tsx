import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { registerSchema, type RegisterFormValues } from '../lib/schemas';
import { useRegister } from '../hooks/AuthMutation';


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
          <Link to="/login" className="text-pink-500 hover:text-pink-400">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <input
            type="text"
            autoComplete="username"
            placeholder="seu_usuario"
            {...register('username')}
          />
          {errors.username?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            autoComplete="name"
            placeholder="seu nome"
            {...register('name')}
          />
          {errors.name?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password?.message && (
            <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
          )}

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
        </div>

        {registerUser.isError && (
  <p className="text-red-400">
    {registerUser.error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'}
  </p>
)}

        <button
          type="submit"
          disabled={registerUser.isPending}
          className="w-full rounded-md bg-pink-500 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-pink-400 disabled:opacity-50"
        >
          {registerUser.isPending ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
    </AuthLayout>
  );
}