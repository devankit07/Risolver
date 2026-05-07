import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@resolver/ui';
import { X, Search, Paperclip, Send, Info } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import socket from '../services/socket.js';
// import api from '../services/api.js'; // removed unused import
import {
  fetchTeamMembers,
  clearActiveThread,
  setActiveThreadUserId,
  fetchThread,
  sendMessageThunk,
  receiveMessage,
  addSentMessage,
  markThreadRead,
} from '../store/messagesSlice.js';

// Helper utilities -----------------------------------------------------------
function relativeTime(date) {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

function dateSeparatorLabel(date) {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

function groupByDate(messages) {
  const groups = [];
  let lastLabel = null;
  messages.forEach((m) => {
    const label = dateSeparatorLabel(m.createdAt);
    if (label !== lastLabel) {
      groups.push({ type: 'separator', label });
      lastLabel = label;
    }
    groups.push({ type: 'message', data: m });
  });
  return groups;
}

function StatusDot({ status }) {
  const color =
    status === 'online'
      ? 'bg-emerald-500'
      : status === 'away'
      ? 'bg-amber-400'
      : 'bg-slate-400';
  return <span className={`h-2 w-2 rounded-full shrink-0 ${color}`} />;
}

function ThreadItemRow({ user, selected, onClick, canMessage }) {
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
        <Avatar name={user?.name ?? '?'} size={36} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${
            user?.status === 'online'
              ? 'bg-emerald-500'
              : user?.status === 'away'
              ? 'bg-amber-400'
              : 'bg-slate-400'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-[13px] font-semibold text-[var(--text-primary,#1e293b)]">
            {user?.name ?? 'Unknown'}
          </p>
          {/* placeholder for last activity if needed */}
        </div>
        <p className="truncate text-[12px] text-[var(--text-secondary,#64748b)]">
          {canMessage ? '' : '(cannot message)'}
        </p>
      </div>
    </button>
  );
}

function MessageBubbleRow({ message, isOwn, otherName }) {
  const time = message.createdAt ? format(new Date(message.createdAt), 'h:mm a') : '';
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
    );
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
  );
}

export default function Conversations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((s) => s.auth);
  const myId = String(auth.user?._id ?? auth.user?.id ?? '');
  const myRole = (auth.user?.role ?? '').toLowerCase();

  const { members, loading: loadingMembers } = useSelector((s) => s.team);
  const {
    activeThread,
    activeThreadUserId,
    loadingMessages,
    sendingMessage,
  } = useSelector((s) => s.messages);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load team members once
  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  // Socket listeners (same as in Messages page)
  useEffect(() => {
    const onMsgNew = ({ message, threadId }) => {
      dispatch(receiveMessage({ message, threadId }));
      if (activeThreadUserId && String(message.sender?._id ?? message.sender) === activeThreadUserId) {
        dispatch(fetchThread(activeThreadUserId));
      }
    };
    const onMsgSent = ({ message, threadId }) => {
      dispatch(addSentMessage({ message, threadId }));
    };
    const onRead = ({ threadId }) => {
      dispatch(markThreadRead(threadId));
    };
    socket.on('message:new', onMsgNew);
    socket.on('message:sent', onMsgSent);
    socket.on('messages:read', onRead);
    return () => {
      socket.off('message:new', onMsgNew);
      socket.off('message:sent', onMsgSent);
      socket.off('messages:read', onRead);
    };
  }, [activeThreadUserId, dispatch]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages?.length]);

  // Open a thread with a user
  const openThread = useCallback(
    (userId) => {
      dispatch(setActiveThreadUserId(String(userId)));
      dispatch(fetchThread(String(userId)));
      setDraft('');
    },
    [dispatch]
  );

  const handleSend = useCallback(() => {
    const content = draft.trim();
    if (!content || !activeThreadUserId || sendingMessage) return;
    dispatch(sendMessageThunk({ receiverId: activeThreadUserId, content }));
    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [draft, activeThreadUserId, sendingMessage, dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Determine who can be messaged based on role rules
  const canMessage = (targetUser) => {
    const targetRole = (targetUser?.role ?? '').toLowerCase();
    if (targetRole === 'admin' && myRole !== 'admin' && myRole !== 'manager') return false;
    // Everyone else can message each other
    return true;
  };

  const filteredMembers = useMemo(
    () => members.filter((m) => String(m._id ?? m.id) !== myId && m.name?.toLowerCase().includes(search.toLowerCase())),
    [members, myId, search]
  );

  const grouped = useMemo(() => groupByDate(activeThread?.messages ?? []), [activeThread?.messages]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Left side – user selector */}
      <div className="flex min-h-[560px] flex-1 overflow-hidden rounded-[12px] border bg-white shadow-lg">
        <div className="flex w-[260px] shrink-0 flex-col border-r">
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <h1 className="text-[14px] font-semibold">Conversations</h1>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="relative mt-2 px-4">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-[6px] border border-[var(--border,#e2e8f0)] bg-white py-1.5 pl-8 pr-3 text-[12px] outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
            />
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {loadingMembers ? (
              <p className="text-center text-sm text-slate-500">Loading users…</p>
            ) : filteredMembers.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No users found.</p>
            ) : (
              filteredMembers.map((u) => (
                <ThreadItemRow
                  key={String(u._id ?? u.id)}
                  user={u}
                  selected={String(u._id ?? u.id) === activeThreadUserId}
                  canMessage={canMessage(u)}
                  onClick={() => openThread(u._id ?? u.id)}
                />
              ))
            )}
          </div>
        </div>
        {/* Right side – chat view */}
        <div className="flex flex-1 flex-col">
          {activeThreadUserId && activeThread ? (
            <>
              {/* Header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={activeThread.otherUser?.name ?? '?'} size={32} />
                  <StatusDot status={activeThread.otherUser?.status} />
                  <div>
                    <p className="font-semibold text-[var(--text-primary,#1e293b)]">
                      {activeThread.otherUser?.name ?? '—'}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary,#64748b)]">
                      {activeThread.otherUser?.status === 'online'
                        ? 'Online'
                        : activeThread.otherUser?.status === 'away'
                        ? 'Away'
                        : 'Offline'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-[6px] p-2 text-slate-400 hover:bg-slate-50"
                  onClick={() => {
                    dispatch(clearActiveThread());
                    navigate('/conversations');
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              {/* Message list */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent,#4f46e5)] border-t-transparent" />
                  </div>
                ) : grouped.length === 0 ? (
                  <p className="py-8 text-center text-sm text-[var(--text-secondary,#64748b)]">
                    No messages yet. Say hi!
                  </p>
                ) : (
                  grouped.map((item, idx) =>
                    item.type === 'separator' ? (
                      <div key={`sep-${idx}`} className="my-4 flex justify-center">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[var(--text-secondary,#64748b)]">
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
                    )
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input */}
              <div className="shrink-0 border-t bg-white px-4 py-2.5">
                <div className="flex items-end gap-2">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600">
                    <Paperclip size={18} />
                  </button>
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Message…"
                    className="flex-1 resize-none rounded-[8px] border border-[var(--border,#e2e8f0)] bg-[var(--bg-base,#f8fafc)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim() || sendingMessage || !canMessage(activeThread.otherUser)}
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--accent,#4f46e5)] text-white hover:brightness-110 disabled:opacity-40"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-dim,#eef2ff)]">
                <Info size={28} className="text-indigo-300" />
              </div>
              <p className="text-lg font-semibold text-[var(--text-primary,#1e293b)]">Select a conversation</p>
              <p className="max-w-xs text-sm text-[var(--text-secondary,#64748b)]">
                Choose a teammate to start a private chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
