import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your hospital's management platform"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
