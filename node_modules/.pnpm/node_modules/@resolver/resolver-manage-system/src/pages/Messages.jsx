import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveConversation, sendMessage } from '../store/messagesSlice.js'
import { MessageBubble, Avatar } from '@resolver/ui'

export default function Messages() {
  const dispatch = useDispatch()
  const { conversations, activeConversationId } = useSelector((s) => s.messages)
  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const [draft, setDraft] = useState('')
  const feedRef = useRef(null)

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [activeConv?.messages?.length])

  function send() {
    if (!draft.trim() || !activeConversationId) return
    dispatch(sendMessage({ conversationId: activeConversationId, content: draft.trim() }))
    setDraft('')
  }

  return (
    <div className="flex h-[min(70vh,calc(100vh-8rem))] -mx-1 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <div className="w-80 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/80">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <span className="text-[14px] font-semibold text-[#0f172a]">Messages</span>
          <button
            type="button"
            className="h-8 px-3 rounded-lg text-[11px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca]"
          >
            + New
          </button>
        </div>

        <div className="px-3 py-2 border-b border-slate-200 bg-white">
          <input
            placeholder="Search conversations…"
            className="w-full h-9 px-3 rounded-lg text-[13px] outline-none border border-slate-200 bg-slate-50 text-[#0f172a] placeholder:text-slate-400 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-[13px] text-center mt-12 text-slate-400">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => dispatch(setActiveConversation(conv.id))}
                className={`w-full flex items-center gap-3 px-3 py-3 border-b border-slate-100 text-left transition-colors hover:bg-white ${
                  conv.id === activeConversationId ? 'bg-[#eef2ff] border-l-[3px] border-l-[#4f46e5]' : 'border-l-[3px] border-l-transparent'
                }`}
              >
                <Avatar name={conv.name} size={34} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[13px] font-semibold truncate text-[#0f172a]">{conv.name}</span>
                    <span className="text-[10px] shrink-0 text-slate-400">{conv.timestamp}</span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5 text-slate-500">{conv.preview}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-[#4f46e5] text-white">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 shrink-0 bg-slate-50/80">
            <Avatar name={activeConv.name} size={32} />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#0f172a]">{activeConv.name}</span>
              <span className="text-[11px] text-[#4f46e5] font-medium">Online</span>
            </div>
            <div className="flex-1" />
            <span className="text-[10px] px-2 py-1 rounded-full border border-[#c7d2fe] bg-[#eef2ff] text-[#3730a3] font-medium">
              INC-041
            </span>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto py-3 bg-slate-50/50">
            {activeConv.messages.length === 0 ? (
              <p className="text-[13px] text-center mt-12 text-slate-400">No messages yet</p>
            ) : (
              activeConv.messages.map((msg) => <MessageBubble key={msg.id} message={msg} variant="light" />)
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-slate-200 bg-white">
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <PaperclipIcon />
            </button>
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <LinkIcon />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Type a message…"
              className="flex-1 h-10 px-3 rounded-xl text-[13px] outline-none border border-slate-200 bg-slate-50 text-[#0f172a] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
            />
            <button
              type="button"
              onClick={send}
              className="h-10 px-4 rounded-lg text-[13px] font-semibold bg-[#4f46e5] text-white hover:bg-[#4338ca]"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-50/50 text-slate-400 text-[13px]">Select a conversation</div>
      )}
    </div>
  )
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 6.5L6.5 12a3.5 3.5 0 01-5-5l6-6a2 2 0 012.83 2.83L4.83 9.83A.5.5 0 014.1 9.1l5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 8.5l3-3M6 4.5H4a2.5 2.5 0 000 5h2M8 9.5h2a2.5 2.5 0 000-5H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
