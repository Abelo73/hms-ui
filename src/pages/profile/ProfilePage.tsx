import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Loader2, Save, User, Shield, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional() }).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match or current password is required',
  path: ['confirmPassword'] });

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '' } });

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (user) {
        await updateUser({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber });
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  return (
    <MainLayout pageTitle="Account Settings">
          <div className="max-w-[800px] mx-auto space-y-8">
            
            {/* Header section */}
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-8">
              <div className="size-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 text-xl font-semibold shadow-sm ring-4 ring-white">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
                <p className="text-sm text-zinc-500 mt-1">Manage your personal information and security preferences</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-600 font-normal px-2.5 py-0.5">
                  ID: {user?.id?.split('-')[0]}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Account Info */}
              <section className="space-y-6">
                <div>
                  <h2 className="text-base font-medium flex items-center gap-2 text-zinc-900">
                    <User className="size-4 opacity-70" />
                    Personal Information
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="text-[13px] font-medium text-zinc-700">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName')}
                        className="w-full h-9 px-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                      />
                      {errors.firstName && <p className="text-xs text-rose-500 font-medium">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="text-[13px] font-medium text-zinc-700">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        {...register('lastName')}
                        className="w-full h-9 px-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                      />
                      {errors.lastName && <p className="text-xs text-rose-500 font-medium">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[13px] font-medium text-zinc-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full h-9 pl-9 pr-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phoneNumber" className="text-[13px] font-medium text-zinc-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                      <input
                        id="phoneNumber"
                        type="text"
                        {...register('phoneNumber')}
                        className="w-full h-9 pl-9 pr-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
                      {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </section>

              {/* Security section */}
              <section className="space-y-6">
                <div>
                  <h2 className="text-base font-medium flex items-center gap-2 text-zinc-900">
                    <Lock className="size-4 opacity-70" />
                    Security & Authentication
                  </h2>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-zinc-700">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...register('currentPassword')}
                          className="w-full h-9 px-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                          {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            {...register('newPassword')}
                            className="w-full h-9 px-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-zinc-700">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            className="w-full h-9 px-3 bg-zinc-50/50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                    <p className="text-xs text-zinc-500">Last changed: 3 months ago</p>
                    <Button variant="outline" className="h-9 px-4 border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                      Update Password
                    </Button>
                  </div>
                </div>
              </section>

              {/* Roles Badge section */}
              <section className="bg-zinc-100/50 rounded-xl p-4 border border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-zinc-400" />
                    <div>
                      <p className="text-[13px] font-medium text-zinc-900">System Roles</p>
                      <p className="text-[11px] text-zinc-500">Your assigned access levels within the hospital system</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {user?.roles?.map((role) => (
                      <Badge key={role} className="bg-zinc-900 text-white font-normal hover:bg-zinc-900">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>

                </div>
          </div>
    </MainLayout>
  );
}
