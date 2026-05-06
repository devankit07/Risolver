import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Bell, ExternalLink, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FloatingNotifications() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const myId = String(user?._id ?? user?.id ?? '');
  const notificationsCache = useSelector((s) => s.team.notificationsCache ?? {});
  
  const [activeToasts, setActiveToasts] = useState([]);
  const shownIds = useRef(new Set());

  useEffect(() => {
    const list = notificationsCache[myId] ?? [];
    if (list.length > 0) {
      const latest = list[0];
      
      // Only show if it's new, not already shown this session, and recent
      const isRecent = new Date(latest.createdAt).getTime() > Date.now() - 15000;
      const alreadyShown = shownIds.current.has(latest._id);

      if (!latest.isRead && isRecent && !alreadyShown) {
        shownIds.current.add(latest._id);
        
        setActiveToasts((prev) => {
          if (prev.some(t => t._id === latest._id)) return prev;
          return [...prev, latest];
        });

        // Auto remove after 6 seconds
        setTimeout(() => {
          setActiveToasts((prev) => prev.filter(t => t._id !== latest._id));
        }, 6000);
      }
    }
  }, [notificationsCache, myId]);


  const removeToast = (id) => {
    setActiveToasts((prev) => prev.filter(t => t._id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {activeToasts.map((n) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative overflow-hidden rounded-[12px] border border-indigo-100 bg-white p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.type?.startsWith('report') ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {n.type?.startsWith('report') ? <ShieldAlert size={20} /> : <Bell size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-[#1e293b] truncate">{n.title}</h4>
                <p className="mt-0.5 text-[12px] text-[#64748b] line-clamp-2">{n.body}</p>
                {(n.incidentId || n.type?.startsWith('report')) && (
                  <button
                    onClick={() => {
                      if (n.type === 'report_submitted' || n.type === 'report_pending') {
                        navigate('/reports');
                      } else if (n.incidentId) {
                        navigate(`/workspace/${n.incidentId}`);
                      }
                      removeToast(n._id);
                    }}
                    className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    {n.type?.startsWith('report') ? 'Review Report' : 'Open Workspace'} <ExternalLink size={12} />
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(n._id)}
                className="text-[#94a3b8] hover:text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>
            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-indigo-500"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
