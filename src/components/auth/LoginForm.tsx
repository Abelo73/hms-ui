import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/auth/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validation/schemas';

const inputClass =
  'w-full h-11 px-3.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/8 focus:border-zinc-900 transition-colors';

const labelClass = 'block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="username" className={labelClass}>Username</label>
        <input
          id="username"
          type="text"
          {...register('username')}
          className={inputClass}
          placeholder="your.username"
          autoComplete="username"
        />
        {errors.username && (
          <p className="mt-1.5 text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className={labelClass} style={{ marginBottom: 0 }}>Password</label>
          <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`${inputClass} pr-11`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
        />
        <label htmlFor="remember" className="text-xs text-zinc-600 cursor-pointer select-none">
          Keep me signed in
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>

      <p className="text-center text-sm text-zinc-500 pt-1">
        No account yet?{' '}
        <Link to="/register" className="text-zinc-900 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
