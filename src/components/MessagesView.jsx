import PropTypes from 'prop-types'
import { useState } from 'react'

export function MessagesView({
  juniors,
  seniors,
  currentJunior,
  messages,
  onSendMessage,
  compact = false,
}) {
  const buddies = seniors
  const [firstSenior] = buddies
  const defaultConversationId = firstSenior?.id

  return (
    <ConversationShell
      juniors={juniors}
      seniors={seniors}
      currentJunior={currentJunior}
      messages={messages}
      onSendMessage={onSendMessage}
      defaultConversationId={defaultConversationId}
      compact={compact}
    />
  )
}

function ConversationShell({
  juniors,
  seniors,
  currentJunior,
  messages,
  onSendMessage,
  defaultConversationId,
  compact,
}) {
  const [activeBuddyId, setActiveBuddyId] = useState(defaultConversationId)

  const activeBuddy = seniors.find((s) => s.id === activeBuddyId) || seniors[0]
  const conversationMessages = messages
    .filter(
      (m) =>
        (m.from === currentJunior.id && m.to === activeBuddy.id) ||
        (m.to === currentJunior.id && m.from === activeBuddy.id),
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const text = formData.get('text')?.toString().trim()
    if (!text || !activeBuddy) return
    onSendMessage({
      from: currentJunior.id,
      to: activeBuddy.id,
      text,
    })
    event.currentTarget.reset()
  }

  return (
    <div
      className={`grid gap-4 ${
        compact ? 'grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]' : 'lg:grid-cols-3'
      }`}
    >
      <section className="space-y-3">
        {!compact && (
          <header>
            <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
              Conversations
            </p>
            <h2 className="text-lg font-bold text-tumSecondary">Messages</h2>
          </header>
        )}
        <div className="bg-white rounded-2xl card-shadow border border-border divide-y divide-border overflow-hidden">
          {seniors.map((senior) => {
            const isActive = senior.id === activeBuddy?.id
            const unreadCount = messages.filter(
              (m) =>
                m.from === senior.id &&
                m.to === currentJunior.id &&
                new Date(m.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            ).length
            return (
              <button
                key={senior.id}
                onClick={() => setActiveBuddyId(senior.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-xs transition ${
                  isActive ? 'bg-tumBlue/5' : 'bg-white hover:bg-background'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-white text-[11px] font-semibold ${senior.avatarColor}`}
                  >
                    {senior.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-medium text-tumSecondary">{senior.name}</p>
                    <p className="text-[11px] text-tumSecondary/60 line-clamp-1">
                      {senior.studyProgram}
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tumBlue/10 text-tumBlue border border-tumBlue/30">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col bg-white rounded-2xl card-shadow border border-border min-h-[260px]">
        {activeBuddy ? (
          <>
            <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-semibold ${activeBuddy.avatarColor}`}
                >
                  {activeBuddy.name
                    .split(' ')
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-tumSecondary">
                    {activeBuddy.name}
                  </p>
                  <p className="text-[11px] text-tumBlue">Senior Buddy</p>
                </div>
              </div>
              <p className="text-[10px] text-tumSecondary/50">
                Messages are stored in-memory for this demo.
              </p>
            </div>
            <div className="flex-1 overflow-auto px-4 py-3 space-y-2 bg-background">
              {conversationMessages.length === 0 && (
                <p className="text-xs text-tumSecondary/60">
                  Start the conversation by sending your first message.
                </p>
              )}
              {conversationMessages.map((m) => {
                const isOwn = m.from === currentJunior.id
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      isOwn ? 'justify-end' : 'justify-start'
                    } text-xs gap-1`}
                  >
                    {!isOwn && (
                      <div
                        className={`mt-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold ${activeBuddy.avatarColor}`}
                      >
                        {activeBuddy.name
                          .split(' ')
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join('')}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                        isOwn
                          ? 'bg-tumBlue text-white rounded-br-sm'
                          : 'bg-white text-tumSecondary border border-border rounded-bl-sm'
                      }`}
                    >
                      <p className="text-[11px] mb-0.5 opacity-70">
                        {new Date(m.timestamp).toLocaleString()}
                      </p>
                      <p className="leading-snug">{m.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <form
              onSubmit={handleSubmit}
              className="border-t border-border px-3 py-2 flex items-center gap-2"
            >
              <input
                name="text"
                placeholder="Write a message..."
                className="flex-1 rounded-full border border-border px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-tumBlue/20 focus:border-tumBlue"
              />
              <button
                type="submit"
                className="rounded-full bg-tumBlue text-white px-4 py-1.5 text-xs font-medium hover:bg-tumSecondary transition"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-tumSecondary/60 px-4">
            No senior buddies configured.
          </div>
        )}
      </section>
    </div>
  )
}

MessagesView.propTypes = {
  juniors: PropTypes.array.isRequired,
  seniors: PropTypes.array.isRequired,
  currentJunior: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  compact: PropTypes.bool,
}

ConversationShell.propTypes = {
  juniors: PropTypes.array.isRequired,
  seniors: PropTypes.array.isRequired,
  currentJunior: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  defaultConversationId: PropTypes.string,
  compact: PropTypes.bool,
}

