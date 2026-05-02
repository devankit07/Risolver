import { Shield, CheckCircle2 } from 'lucide-react';

export function AuthSplitLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#ffffff', backgroundImage: 'none' }}>
      {/* Left Panel — Dark purple/indigo with glowing circle */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)' }}
      >
        {/* Animated background grid overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Radial indigo glow behind the circle */}
        <div 
          className="absolute z-0 pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(79,70,229,0.2) 30%, rgba(67,56,202,0.1) 50%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Outer glowing indigo ring */}
        <div 
          className="absolute z-[1] pointer-events-none rounded-full"
          style={{
            width: '400px',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(99,102,241,0.4)',
            boxShadow: '0 0 60px rgba(99,102,241,0.25), 0 0 120px rgba(99,102,241,0.1), inset 0 0 60px rgba(99,102,241,0.08)',
          }}
        />

        {/* Second outer ring - sky */}
        <div 
          className="absolute z-[1] pointer-events-none rounded-full"
          style={{
            width: '460px',
            height: '460px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(14,165,233,0.2)',
            boxShadow: '0 0 40px rgba(14,165,233,0.1)',
          }}
        />

        {/* Logo Circle — centered with indigo glow */}
        <div className="relative z-10 flex items-center justify-center">
          <div 
            className="relative flex items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-xl border border-indigo-500/30"
            style={{
              width: '280px',
              height: '280px',
              boxShadow: '0 0 80px rgba(99,102,241,0.4), 0 0 160px rgba(99,102,241,0.15), 0 0 40px rgba(14,165,233,0.3)',
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-500/50">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white [font-family:Georgia,serif] italic">Resolver</h2>
                <div className="mt-1 h-1 w-12 bg-indigo-500 mx-auto rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Text content below the circle */}
        <div className="relative z-10 mt-16 text-center px-12">
          <h1 className="text-xl font-semibold tracking-tight text-white opacity-90">Enterprise Incident Management</h1>
          <p className="mt-4 text-sm text-indigo-200/50 max-w-sm mx-auto leading-relaxed">
            Engineered for high-stakes environments where clarity and speed are paramount.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-300/60">
            <CheckCircle2 size={14} className="text-indigo-400" />
            RELIABILITY CERTIFIED
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-between px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
          <span>System Status: Operational</span>
          <span>v2.4.0-Stable</span>
        </div>

        {/* Floating tech dots */}
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full z-10" style={{ background: 'rgba(99,102,241,0.5)', boxShadow: '0 0 8px rgba(99,102,241,0.4)' }} />
        <div className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full z-10" style={{ background: 'rgba(14,165,233,0.5)', boxShadow: '0 0 6px rgba(14,165,233,0.4)' }} />
        <div className="absolute bottom-[25%] left-[25%] w-1 h-1 rounded-full z-10" style={{ background: 'rgba(99,102,241,0.4)', boxShadow: '0 0 6px rgba(99,102,241,0.3)' }} />
        <div className="absolute bottom-[35%] right-[15%] w-1.5 h-1.5 rounded-full z-10" style={{ background: 'rgba(14,165,233,0.4)', boxShadow: '0 0 8px rgba(14,165,233,0.3)' }} />
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
