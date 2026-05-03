import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  ChatPanel,
  ThreadItem,
  BroadcastItem,
  MessageBubble,
  Avatar,
} from '@resolver/ui'
import { Pencil, Search, Phone, Video, Info, Paperclip, Hash, Smile, Send } from 'lucide-react'

const API = import.meta.env.VITE_API_URL ?? ''

const DEMO_THREADS = [
  {
    id: 'th1',
    name: 'Sara Patel',
    incidentTag: 'INC-041',
    preview: 'P99 still elevated on gateway — checking pool size now.',
    time: '2m ago',
    unread: 2,
  },
  {
    id: 'th2',
    name: 'James Lee',
    incidentTag: 'INC-040',
    preview: 'Failover complete. Monitoring lag.',
    time: '18m ago',
    unread: 0,
  },
  {
    id: 'th3',
    name: 'Priya Nair',
    incidentTag: 'INC-039',
    preview: 'Postmortem draft attached for review.',
    time: '1h ago',
    unread: 1,
  },
]

const DEMO_BROADCASTS = [
  {
    id: 'b1',
    title: 'Scheduled maintenance — US-East',
    sentBy: 'Priya Nair',
    time: 'May 2',
    scope: 'all',
  },
  {
    id: 'b2',
    title: 'Policy update: severity thresholds',
    sentBy: 'Priya Nair',
    time: 'Apr 28',
    scope: 'role',
    roleLabel: 'Engineering',
  },
]

const DEMO_MESSAGES = [
  { content: 'Seeing timeouts on checkout API — anyone else?', timestamp: '9:12 AM', author: 'Sara Patel', isOwn: false },
  { content: 'Replicated in staging — investigating DB pool.', timestamp: '9:14 AM', author: 'You', isOwn: true },
  {
    content: 'Recommend raising pool to 200 based on similar incidents.',
    timestamp: '9:15 AM',
    author: 'AI Assistant',
    isOwn: false,
    isAi: true,
  },
]

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'broadcast' ? 'broadcast' : 'threads'
  const [q, setQ] = useState('')
  const [selectedThread, setSelectedThread] = useState(DEMO_THREADS[0]?.id ?? '')
  const [selectedBroadcast, setSelectedBroadcast] = useState(DEMO_BROADCASTS[0]?.id ?? '')
  const [feed, setFeed] = useState(DEMO_MESSAGES)
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (!API) return
    const socket = io(`${API}/messages`, { transports: ['websocket'] })
    socket.on('message:new', () => {})
    return () => socket.disconnect()
  }, [])

  const filteredThreads = useMemo(
    () =>
      DEMO_THREADS.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.incidentTag.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  )

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
      <ChatPanel
        className="min-h-[560px] flex-1 border-0 shadow-[0_3px_16px_rgba(15,23,42,0.08)]"
        left={
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-[var(--border,#e2e8f0)] px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-[14px] font-medium text-[var(--text-primary,#1e293b)]">Messages</h1>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--accent,#4f46e5)] text-white hover:brightness-110"
                  aria-label="Compose"
                >
                  <Pencil size={16} />
                </button>
              </div>
              <div className="mt-3 flex rounded-[6px] bg-white p-0.5 ring-1 ring-[var(--border,#e2e8f0)]">
                <button
                  type="button"
                  onClick={() => setSearchParams({ tab: 'threads' })}
                  className={`flex-1 rounded-[6px] px-3 py-1.5 text-[12px] font-medium ${
                    tab === 'threads' ? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]' : 'text-[var(--text-secondary,#64748b)]'
                  }`}
                >
                  Threads
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ tab: 'broadcast' })}
                  className={`flex-1 rounded-[6px] px-3 py-1.5 text-[12px] font-medium ${
                    tab === 'broadcast' ? 'bg-[var(--accent-dim,#eef2ff)] text-[var(--accent,#4f46e5)]' : 'text-[var(--text-secondary,#64748b)]'
                  }`}
                >
                  Broadcast
                </button>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-[6px] border border-[var(--border,#e2e8f0)] bg-white py-2 pl-9 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/25"
                />
              </div>
            </div>

            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
              {tab === 'threads' ? (
                <div className="flex flex-col gap-1">
                  {filteredThreads.map((t) => (
                    <ThreadItem
                      key={t.id}
                      name={t.name}
                      incidentTag={t.incidentTag}
                      preview={t.preview}
                      time={t.time}
                      unread={t.unread}
                      selected={selectedThread === t.id}
                      onClick={() => setSelectedThread(t.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="mb-2 w-full rounded-[6px] border border-dashed border-[var(--accent-border,#c7d2fe)] bg-white py-2 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)]"
                  >
                    New broadcast
                  </button>
                  {DEMO_BROADCASTS.map((b) => (
                    <BroadcastItem
                      key={b.id}
                      title={b.title}
                      sentBy={b.sentBy}
                      time={b.time}
                      scope={b.scope}
                      roleLabel={b.roleLabel}
                      selected={selectedBroadcast === b.id}
                      onClick={() => setSelectedBroadcast(b.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        }
        right={
          <div className="flex h-full min-h-0 flex-col">
            {tab === 'threads' && selectedThread ? (
              <>
                <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border,#e2e8f0)] px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name="Sara Patel" size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-[var(--text-primary,#1e293b)]">Sara Patel</p>
                      <Link
                        to="/workspace/INC-041"
                        className="mt-0.5 inline-block rounded-md bg-[var(--accent-dim,#eef2ff)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent,#4f46e5)] hover:underline"
                      >
                        INC-041
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--text-secondary,#64748b)]">
                    <span className="mr-2 flex items-center gap-1 text-[11px]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
                    </span>
                    <button type="button" className="rounded-[6px] p-2 hover:bg-slate-50">
                      <Phone size={18} />
                    </button>
                    <button type="button" className="rounded-[6px] p-2 hover:bg-slate-50">
                      <Video size={18} />
                    </button>
                    <button type="button" className="rounded-[6px] p-2 hover:bg-slate-50">
                      <Info size={18} />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                  <div className="flex justify-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-[var(--text-secondary,#64748b)]">
                      Today
                    </span>
                  </div>
                  {feed.map((m, i) => (
                    <MessageBubble key={i} variant="light" message={m} />
                  ))}
                </div>

                <div className="shrink-0 border-t border-[var(--border,#e2e8f0)] bg-white p-3">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-1 pb-1 text-[var(--text-secondary,#64748b)]">
                      <button type="button" className="rounded-[6px] p-2 hover:bg-slate-50">
                        <Paperclip size={18} />
                      </button>
                      <button type="button" className="rounded-[6px] p-2 hover:bg-slate-50">
                        <Hash size={18} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Message…"
                      className="min-h-[44px] flex-1 resize-none rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
                    />
                    <button type="button" className="rounded-[6px] p-2 text-[var(--text-secondary,#64748b)] hover:bg-slate-50">
                      <Smile size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!draft.trim()) return
                        setFeed((prev) => [
                          ...prev,
                          { content: draft.trim(), timestamp: 'Now', author: 'You', isOwn: true },
                        ])
                        setDraft('')
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent,#4f46e5)] text-white hover:brightness-110"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : tab === 'broadcast' && selectedBroadcast ? (
              <>
                <div className="flex h-12 items-center border-b border-[var(--border,#e2e8f0)] px-4">
                  <p className="text-[14px] font-medium text-[var(--text-primary,#1e293b)]">Broadcast to All Team</p>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] p-4">
                    <p className="text-[11px] font-medium text-[var(--text-secondary,#64748b)]">Sent by Priya Nair · May 2</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-primary,#1e293b)]">
                      Maintenance window announced for database failover practice. No customer impact expected.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                  <Search size={28} />
                </div>
                <p className="text-[15px] font-medium text-[var(--text-primary,#1e293b)]">Select a thread to start messaging</p>
                <p className="max-w-sm text-[13px] text-[var(--text-secondary,#64748b)]">
                  Choose a conversation from the left or switch to Broadcast for team-wide updates.
                </p>
              </div>
            )}
          </div>
        }
      />
    </div>
  )
}
