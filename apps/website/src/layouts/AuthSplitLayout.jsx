import { CheckCircle2, Activity } from 'lucide-react';

/* ── tiny floating orb ── */
function Orb({ style }) {
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        animation: `orbFloat ${style.duration ?? 6}s ease-in-out infinite`,
        animationDelay: style.delay ?? '0s',
        ...style,
      }}
    />
  );
}

export function AuthSplitLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes rotateSlowReverse {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50% { opacity:0.3; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes scanLine {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
      `}</style>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, #1e1460 0%, #0d0d1f 55%, #050510 100%)',
        }}
      >
        {/* ── deep space star-field ── */}
        {[...Array(55)].map((_, i) => {
          const size = Math.random() < 0.15 ? 2 : 1;
          return (
            <div key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                width: size, height: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          );
        })}

        {/* ── background grid ── */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* ── large deep glow blob ── */}
        <div className="absolute pointer-events-none" style={{
          width: 700, height: 700,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -52%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(79,70,229,0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* ── outer dashed orbit ring (slow rotation) ── */}
        <div className="absolute pointer-events-none" style={{
          width: 560, height: 560,
          top: '50%', left: '50%',
          borderRadius: '50%',
          border: '1px dashed rgba(99,102,241,0.18)',
          animation: 'rotateSlow 40s linear infinite',
        }}>
          {/* orbit dot */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full"
            style={{ background: '#6366f1', boxShadow: '0 0 12px #6366f1, 0 0 24px rgba(99,102,241,0.5)' }} />
        </div>

        {/* ── middle orbit ring (reverse) ── */}
        <div className="absolute pointer-events-none" style={{
          width: 440, height: 440,
          top: '50%', left: '50%',
          borderRadius: '50%',
          border: '1px solid rgba(14,165,233,0.12)',
          animation: 'rotateSlowReverse 28s linear infinite',
        }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full"
            style={{ background: '#0ea5e9', boxShadow: '0 0 10px #0ea5e9, 0 0 20px rgba(14,165,233,0.4)' }} />
        </div>

        {/* ── core glow circle ── */}
        <div className="absolute pointer-events-none rounded-full" style={{
          width: 340, height: 340,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }} />

        {/* ── glass card center ── */}
        <div className="relative z-10 flex items-center justify-center"
          style={{ animation: 'fadeSlideUp 0.8s ease both', animationDelay: '0.2s' }}>
          <div className="relative flex flex-col items-center justify-center rounded-full"
            style={{
              width: 300, height: 300,
              background: 'linear-gradient(145deg, rgba(99,102,241,0.18), rgba(15,23,42,0.6))',
              border: '1px solid rgba(99,102,241,0.35)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 80px rgba(99,102,241,0.35), 0 0 200px rgba(99,102,241,0.1), inset 0 0 60px rgba(99,102,241,0.08)',
            }}
          >
            {/* scan-line effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div className="absolute left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.6), transparent)',
                  animation: 'scanLine 3.5s linear infinite',
                }} />
            </div>

            <div className="relative flex flex-col items-center gap-4 px-4">
              <img
                src="/logo.png"
                alt="Resolver"
                width={320}
                height={76}
                className="h-[4.5rem] w-auto max-w-[min(100%,300px)] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:h-20 md:h-[5.25rem]"
                decoding="async"
              />
              <div className="mx-auto h-px w-16"
                style={{
                  background: 'linear-gradient(to right, transparent, #6366f1, transparent)',
                  boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                }} />
            </div>
          </div>
        </div>

        {/* ── headline ── */}
        <div className="relative z-10 mt-14 px-10 text-center"
          style={{ animation: 'fadeSlideUp 0.8s ease both', animationDelay: '0.5s' }}>
          <h1 className="text-[19px] font-semibold tracking-wide text-white/90">
            Enterprise Incident Management
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-indigo-200/45 max-w-[280px] mx-auto">
            Engineered for high-stakes environments where clarity and speed are paramount.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-indigo-300/50"
            style={{ animation: 'fadeSlideUp 0.8s ease both', animationDelay: '0.8s' }}>
            <CheckCircle2 size={12} className="text-indigo-400/60" />
            Reliability Certified
          </div>
        </div>

        {/* ── floating ambient orbs ── */}
        <Orb style={{ width: 180, height: 180, top: '8%', left: '-5%', duration: 8, delay: '0s',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)', filter: 'blur(30px)' }} />
        <Orb style={{ width: 140, height: 140, bottom: '10%', right: '-4%', duration: 10, delay: '2s',
          background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)', filter: 'blur(24px)' }} />
        <Orb style={{ width: 80, height: 80, top: '60%', left: '8%', duration: 7, delay: '1s',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', filter: 'blur(16px)' }} />

        {/* ── floating tech dots ── */}
        {[
          { top: '18%', left: '12%', color: '#6366f1', size: 6 },
          { top: '32%', right: '14%', color: '#0ea5e9', size: 4 },
          { bottom: '22%', left: '18%', color: '#8b5cf6', size: 5 },
          { bottom: '38%', right: '10%', color: '#6366f1', size: 4 },
          { top: '72%', left: '6%', color: '#0ea5e9', size: 3 },
        ].map((dot, i) => (
          <div key={i} className="absolute z-10 rounded-full pointer-events-none"
            style={{
              width: dot.size, height: dot.size,
              top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
              background: dot.color,
              boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
              animation: `pulse ${2 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }} />
        ))}

        {/* ── bottom bar ── */}
        <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-indigo-400/60" />
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/20">Reliability Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={10} className="text-emerald-400/50" />
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/20">All systems nominal</span>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto p-8 lg:w-1/2 bg-white">
        <div className="w-full max-w-md py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
