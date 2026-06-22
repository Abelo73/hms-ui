import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const features = [
  { icon: '🏥', text: 'Unified patient & staff management' },
  { icon: '📋', text: 'Real-time clinical workflows' },
  { icon: '💊', text: 'Integrated pharmacy & billing' },
  { icon: '📊', text: 'Advanced analytics & reporting' },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Top: logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">MediCare HMS</span>
          </div>
        </div>

        {/* Middle: headline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Healthcare<br />management,<br />
            <span className="text-zinc-400">reimagined.</span>
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed mb-10 max-w-xs">
            A complete platform for hospitals to manage patients, staff, billing and clinical workflows — all in one place.
          </p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-zinc-400 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: trust badge */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {['bg-blue-400', 'bg-emerald-400', 'bg-violet-400', 'bg-amber-400'].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full border-2 border-zinc-950 ${c}`} />
              ))}
            </div>
            <span className="text-zinc-500 text-xs">Trusted by 500+ healthcare professionals</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold text-zinc-900 text-base">MediCare HMS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1.5 tracking-tight">{title}</h1>
            <p className="text-zinc-500 text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
