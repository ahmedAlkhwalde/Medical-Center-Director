import { motion as Motion } from "framer-motion";
import { useMemo, useState } from "react";

const ChatsList = ({ chats, activeChatId, onSelectChat }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.lastMessage || "").toLowerCase().includes(q) ||
        (c.role || "").toLowerCase().includes(q)
      );
    });
  }, [chats, query]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-2 py-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث عن دردشة..."
          className="w-full rounded-md border theme-border px-3 py-2 text-sm bg-transparent theme-text outline-none focus:ring-2 focus:ring-(--color-accent)"
        />
      </div>

      <div className="overflow-y-auto no-scrollbar flex-1 p-2">
        <div className="space-y-1">
          {filtered.map((chat) => (
            <Motion.button
              key={chat.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-right p-2 rounded-lg border transition-colors cursor-pointer ${
                activeChatId === chat.id
                  ? "theme-accent-soft border-transparent"
                  : "theme-border theme-hover-surface"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="theme-text-muted text-[10px]">
                  {chat.lastMessageAt}
                </span>
                <h3 className="font-semibold theme-text text-sm truncate">
                  {chat.name}
                </h3>
              </div>

              <p className="text-[11px] theme-text-muted mt-1 truncate">
                {chat.role}
              </p>

              <div className="flex items-center justify-between gap-2 mt-1">
                {chat.unreadCount > 0 ? (
                  <span className="min-w-4 h-4 px-1 text-[9px] rounded-full theme-accent theme-text-on-accent flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                ) : (
                  <span />
                )}

                <p className="text-xs theme-text-muted truncate max-w-[80%]">
                  {chat.lastMessage}
                </p>
              </div>
            </Motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatsList;
