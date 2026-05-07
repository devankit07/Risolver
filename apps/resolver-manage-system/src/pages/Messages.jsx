import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import {
  Pencil, Search, Info, Paperclip, Send, MessageSquare, Megaphone, X,
  Check, ChevronDown, Users,
} from 'lucide-react'
import { Avatar } from '@resolver/ui'
import socket from '../services/socket.js'
import api from '../services/api.js'
import {
  fetchThreads, fetchThread, sendMessageThunk, fetchBroadcasts,
  markBroadcastRead, receiveMessage, addSentMessage, markThreadRead,
  addBroadcast, setActiveThreadUserId, clearActiveThread,
} from '../store/messagesSlice.js'
import NewMessageModal from '../components/NewMessageModal.jsx'
import NewBroadcastModal from '../components/NewBroadcastModal.jsx'

function relativeTime(date) {
  if (!date) return ''
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch { return '' }
}

function dateSeparatorLabel(date) {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d, yyyy')
}

function groupByDate(messages) {
  const groups = []
  let lastLabel = null
  messages.forEach((m) => {
    const label = dateSeparatorLabel(m.createdAt)
    if (label !== lastLabel) {
      groups.push({ type: 'separator', label })
      lastLabel = label
    }
    groups.push({ type: 'message', data: m })
  })
  return groups
}

function StatusDot({ status }) {
  const color = status === 'online' ? 'bg-emerald-500' : status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
  return <span className={`h-2 w-2 rounded-full shrink-0 ${color}`} />
}

function ThreadItemRow({ thread, selected, myId, onClick }) {
  const { otherUser, lastMessage, unreadCount } = thread
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors ${
        selected
          ? 'border-l-[3px] border-[var(--accent,#4f46e5)] bg-[var(--accent-dim,#eef2ff)]'
          : 'border-l-[3px] border-transparent hover:bg-[var(--bg-base,#f8fafc)]'
      }`}
    >
      <div className="relative shrink-0">
        <Avatar name={otherUser?.name ?? '?'} size={36} />
        <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${
          otherUser?.status === 'online' ? 'bg-emerald-500' : otherUser?.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
        }`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">
            {otherUser?.name ?? 'Unknown'}
          </p>
          <span className="shrink-0 text-[10px] text-slate-400">
            {lastMessage?.createdAt ? relativeTime(lastMessage.createdAt) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="truncate text-[12px] text-[var(--text-secondary,#64748b)]">
            {String(lastMessage?.senderId) === String(myId) ? 'You: ' : ''}
            {lastMessage?.content ?? ''}
          </p>
          {unreadCount > 0 && (
            <span className="ml-1 shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function BroadcastRow({ broadcast, selected, onClick }) {
  const targets = broadcast.targetRoles?.includes('all')
    ? 'All team'
    : broadcast.targetRoles?.join(', ') ?? ''
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors ${
        selected ? 'bg-[var(--accent-dim,#eef2ff)]' : 'hover:bg-[var(--bg-base,#f8fafc)]'
      }`}
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent-dim,#eef2ff)]">
        <Megaphone size={14} className="text-[var(--accent,#4f46e5)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">{broadcast.title}</p>
          {!broadcast.isRead && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
        </div>
        <p className="text-[11px] text-[var(--text-secondary,#64748b)]">To: {targets}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          {broadcast.sender?.name ?? 'Unknown'} · {relativeTime(broadcast.createdAt)}
        </p>
      </div>
    </button>
  )
}

export default function Messages() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'broadcast' ? 'broadcast' : 'threads'
  const selectedUserFromQuery = searchParams.get('user')

  const {
    threads, activeThread, activeThreadUserId,
    broadcasts, loadingThreads, loadingMessages,
    loadingBroadcasts, sendingMessage,
  } = useSelector((s) => s.messages)
  const auth = useSelector((s) => s.auth)
  const myId = String(auth.user?._id ?? auth.user?.id ?? '')
  const myRole = auth.user?.role ?? ''
  const canBroadcast = myRole === 'admin' || myRole === 'manager'

  const [q, setQ] = useState('')
  const [draft, setDraft] = useState('')
  const [selectedBroadcastId, setSelectedBroadcastId] = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    dispatch(fetchThreads())
    dispatch(fetchBroadcasts())
  }, [dispatch])

  useEffect(() => {
    const onMsgNew = ({ message, threadId }) => {
      dispatch(receiveMessage({ message, threadId }))
      if (activeThreadUserId && String(message.sender?._id ?? message.sender) === activeThreadUserId) {
        dispatch(fetchThread(activeThreadUserId))
      }
    }
    const onMsgSent = ({ message, threadId }) => {
      dispatch(addSentMessage({ message, threadId }))
    }
    const onRead = ({ threadId }) => {
      dispatch(markThreadRead(threadId))
    }
    const onBroadcast = (broadcast) => {
      dispatch(addBroadcast(broadcast))
    }

    socket.on('message:new', onMsgNew)
    socket.on('message:sent', onMsgSent)
    socket.on('messages:read', onRead)
    socket.on('broadcast:new', onBroadcast)

    return () => {
      socket.off('message:new', onMsgNew)
      socket.off('message:sent', onMsgSent)
      socket.off('messages:read', onRead)
      socket.off('broadcast:new', onBroadcast)
    }
  }, [activeThreadUserId, dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThread?.messages?.length])

  const filteredThreads = useMemo(
    () => threads.filter((t) => t.otherUser?.name?.toLowerCase().includes(q.toLowerCase())),
    [threads, q],
  )

  const filteredBroadcasts = useMemo(
    () => broadcasts.filter((b) => b.title?.toLowerCase().includes(q.toLowerCase())),
    [broadcasts, q],
  )

  const activeBroadcast = useMemo(
    () => broadcasts.find((b) => String(b._id) === selectedBroadcastId),
    [broadcasts, selectedBroadcastId],
  )

  const openThread = useCallback((otherUserId) => {
    dispatch(setActiveThreadUserId(String(otherUserId)))
    dispatch(fetchThread(String(otherUserId)))
    setDraft('')
  }, [dispatch])

  useEffect(() => {
    if (tab !== 'threads' || !selectedUserFromQuery) return
    openThread(selectedUserFromQuery)
  }, [tab, selectedUserFromQuery, openThread])

  const openBroadcast = useCallback((b) => {
    setSelectedBroadcastId(String(b._id))
    if (!b.isRead) dispatch(markBroadcastRead(String(b._id)))
  }, [dispatch])

  const handleSend = useCallback(() => {
    const content = draft.trim()
    if (!content || !activeThreadUserId || sendingMessage) return
    dispatch(sendMessageThunk({ receiverId: activeThreadUserId, content }))
    setDraft('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [draft, activeThreadUserId, sendingMessage, dispatch])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const grouped = useMemo(
    () => groupByDate(activeThread?.messages ?? []),
    [activeThread?.messages],
  )

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
      {composeOpen && (
        <NewMessageModal
          onClose={() => setComposeOpen(false)}
          onSelectUser={(userId) => {
            openThread(userId)
            setSearchParams({ tab: 'threads' })
            setComposeOpen(false)
          }}
        />
      )}
      {broadcastModalOpen && (
        <NewBroadcastModal onClose={() => setBroadcastModalOpen(false)} />
      )}

      <div className="flex min-h-[560px] flex-1 overflow-hidden rounded-[12px] border border-[var(--border,#e2e8f0)] bg-white shadow-[0_3px_16px_rgba(15,23,42,0.08)]">
        {/* LEFT PANEL */}
        <div className="flex w-[300px] shrink-0 flex-col border-r border-[var(--border,#e2e8f0)]">
          {/* Header */}
          <div className="border-b border-[var(--border,#e2e8f0)] px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">Messages</h1>
              <button
                type="button"
                onClick={() => setComposeOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--accent,#4f46e5)] text-white hover:brightness-110"
                aria-label="Compose"
              >
                <Pencil size={14} />
              </button>
            </div>

            <div className="mt-3 flex rounded-[6px] bg-[var(--bg-base,#f8fafc)] p-0.5 ring-1 ring-[var(--border,#e2e8f0)]">
              {['threads', 'broadcast'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setSearchParams({ tab: t }); dispatch(clearActiveThread()) }}
                  className={`flex-1 rounded-[6px] py-1.5 text-[12px] font-medium capitalize transition-colors ${
                    tab === t
                      ? 'bg-[var(--accent,#4f46e5)] text-white shadow-sm'
                      : 'text-[var(--text-secondary,#64748b)] hover:text-[var(--text-primary,#1e293b)]'
                  }`}
                >
                  {t === 'threads' ? 'Threads' : 'Broadcast'}
                </button>
              ))}
            </div>

            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-[6px] border border-[var(--border,#e2e8f0)] bg-white py-1.5 pl-8 pr-3 text-[12px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
              />
            </div>
          </div>

          {/* List */}
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {tab === 'threads' ? (
              <div className="flex flex-col gap-0.5">
                {loadingThreads ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-[8px] px-3 py-2.5">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-100" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-2/3 animate-pulse rounded bg-slate-100" />
                        <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))
                ) : filteredThreads.length === 0 ? (
                  <p className="px-2 py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                    {threads.length === 0 ? 'No threads yet. Start a conversation.' : 'No results.'}
                  </p>
                ) : (
                  filteredThreads.map((t) => (
                    <ThreadItemRow
                      key={t.threadId}
                      thread={t}
                      selected={String(t.otherUser?._id) === activeThreadUserId}
                      myId={myId}
                      onClick={() => openThread(t.otherUser?._id)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {canBroadcast && (
                  <button
                    type="button"
                    onClick={() => setBroadcastModalOpen(true)}
                    className="mb-2 w-full rounded-[6px] border border-dashed border-[var(--accent-border,#c7d2fe)] bg-white py-2 text-[12px] font-semibold text-[var(--accent,#4f46e5)] hover:bg-[var(--accent-dim,#eef2ff)]"
                  >
                    + New broadcast
                  </button>
                )}
                {loadingBroadcasts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-[8px] px-3 py-2.5">
                      <div className="h-7 w-7 shrink-0 animate-pulse rounded-[6px] bg-slate-100" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-3/4 animate-pulse rounded bg-slate-100" />
                        <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))
                ) : filteredBroadcasts.length === 0 ? (
                  <p className="px-2 py-6 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                    No broadcasts yet.
                  </p>
                ) : (
                  filteredBroadcasts.map((b) => (
                    <BroadcastRow
                      key={String(b._id)}
                      broadcast={b}
                      selected={String(b._id) === selectedBroadcastId}
                      onClick={() => openBroadcast(b)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex min-w-0 flex-1 flex-col">
          {tab === 'threads' && activeThread ? (
            <>
              {/* Thread topbar */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border,#e2e8f0)] px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar name={activeThread.otherUser?.name ?? '?'} size={32} />
                    <StatusDot status={activeThread.otherUser?.status} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">
                      {activeThread.otherUser?.name ?? '—'}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary,#64748b)]">
                      {activeThread.otherUser?.status === 'online' ? 'Online' :
                       activeThread.otherUser?.status === 'away' ? 'Away' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button type="button" className="rounded-[6px] p-2 text-slate-400 hover:bg-slate-50">
                  <Info size={18} />
                </button>
              </div>

              {/* Message feed */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent,#4f46e5)] border-t-transparent" />
                  </div>
                ) : activeThread.messages.length === 0 ? (
                  <p className="py-8 text-center text-[13px] text-[var(--text-secondary,#64748b)]">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  grouped.map((item, idx) =>
                    item.type === 'separator' ? (
                      <div key={`sep-${idx}`} className="my-4 flex justify-center">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-[var(--text-secondary,#64748b)]">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <MessageBubbleRow
                        key={String(item.data._id ?? idx)}
                        message={item.data}
                        isOwn={String(item.data.sender?._id ?? item.data.sender) === myId}
                        otherName={activeThread.otherUser?.name}
                      />
                    ),
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="shrink-0 border-t border-[var(--border,#e2e8f0)] bg-white px-4 py-2.5">
                <div className="flex items-end gap-2">
                  <button type="button" className="mb-0.5 p-1.5 text-slate-400 hover:text-slate-600">
                    <Paperclip size={18} />
                  </button>
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onInput={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Message…"
                    className="max-h-[120px] min-h-[38px] flex-1 resize-none rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim() || sendingMessage}
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent,#4f46e5)] text-white hover:brightness-110 disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </>
          ) : tab === 'broadcast' && activeBroadcast ? (
            <>
              <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--border,#e2e8f0)] px-4">
                <Megaphone size={16} className="text-[var(--accent,#4f46e5)]" />
                <p className="truncate text-[14px] font-semibold text-[var(--text-primary,#1e293b)]">
                  {activeBroadcast.title}
                </p>
                <span className="ml-auto shrink-0 text-[11px] text-[var(--text-secondary,#64748b)]">
                  To: {activeBroadcast.targetRoles?.includes('all') ? 'All team' : activeBroadcast.targetRoles?.join(', ')}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="rounded-[10px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={activeBroadcast.sender?.name ?? '?'} size={36} />
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">
                        {activeBroadcast.sender?.name ?? '—'}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary,#64748b)]">
                        {relativeTime(activeBroadcast.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.7] text-[var(--text-primary,#1e293b)]">
                    {activeBroadcast.content}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-dim,#eef2ff)]">
                <MessageSquare size={28} className="text-indigo-300" />
              </div>
              <p className="text-[16px] font-semibold text-[var(--text-primary,#1e293b)]">Select a conversation</p>
              <p className="max-w-xs text-[13px] text-[var(--text-secondary,#64748b)]">
                Choose a thread or switch to Broadcast for team-wide updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageBubbleRow({ message, isOwn, otherName }) {
  const time = message.createdAt
    ? format(new Date(message.createdAt), 'h:mm a')
    : ''

  if (isOwn) {
    return (
      <div className="mb-3 flex flex-col items-end">
        <div
          className="max-w-[65%] rounded-[12px_12px_2px_12px] bg-[var(--accent,#4f46e5)] px-[14px] py-[10px] text-[13px] text-white"
          style={{ wordBreak: 'break-word' }}
        >
          {message.content}
        </div>
        <span className="mt-1 text-[10px] text-slate-400">{time}</span>
      </div>
    )
  }

  return (
    <div className="mb-3 flex items-end gap-2">
      <Avatar name={message.sender?.name ?? otherName ?? '?'} size={24} />
      <div className="flex flex-col">
        <div
          className="max-w-[65%] rounded-[12px_12px_12px_2px] bg-[#f1f5f9] px-[14px] py-[10px] text-[13px] text-[var(--text-primary,#1e293b)]"
          style={{ wordBreak: 'break-word' }}
        >
          {message.content}
        </div>
        <span className="mt-1 text-[10px] text-slate-400">{time}</span>
      </div>
    </div>
  )
}
