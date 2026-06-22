import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/auth/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validation/schemas';

const inputClass =
  'w-full h-11 px-3.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/8 focus:border-zinc-900 transition-colors';

const labelClass = 'block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5';

export function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword: _cp, ...registerData } = data;
      await registerUser(registerData as any);
      toast.success('Account created — welcome!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelClass}>First name</label>
          <input
            id="firstName"
            type="text"
            {...formRegister('firstName')}
            className={inputClass}
            placeholder="John"
            autoComplete="given-name"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last name</label>
          <input
            id="lastName"
            type="text"
            {...formRegister('lastName')}
            className={inputClass}
            placeholder="Doe"
            autoComplete="family-name"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="username" className={labelClass}>Username</label>
        <input
          id="username"
          type="text"
          {...formRegister('username')}
          className={inputClass}
          placeholder="johndoe"
          autoComplete="username"
        />
        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email address</label>
        <input
          id="email"
          type="email"
          {...formRegister('email')}
          className={inputClass}
          placeholder="john@hospital.com"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phoneNumber" className={labelClass}>
          Phone <span className="text-zinc-400 normal-case font-normal">(optional)</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          {...formRegister('phoneNumber')}
          className={inputClass}
          placeholder="+1 234 567 8900"
          autoComplete="tel"
        />
        {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...formRegister('password')}
            className={`${inputClass} pr-11`}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...formRegister('confirmPassword')}
            className={`${inputClass} pr-11`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>

      <p className="text-center text-sm text-zinc-500 pt-1">
        Already have an account?{' '}
        <Link to="/login" className="text-zinc-900 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
