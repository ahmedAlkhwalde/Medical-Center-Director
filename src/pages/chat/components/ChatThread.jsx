import { useEffect, useRef, useState } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChatComposer from "./ChatComposer";

const isImageFile = (fileType) => fileType?.startsWith("image/");

const ChatThread = ({
  chat,
  messages,
  onSendText,
  onSendFile,
  onSendAudio,
  onDeleteMessage,
  onDeleteMessages,
  onBackToChats,
}) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const longPressTimerRef = useRef(null);
  const audioRefs = useRef({});

  useEffect(() => {
    if (!contextMenu) return;
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [contextMenu]);

  useEffect(() => {
    const audioNodes = audioRefs.current;
    return () => {
      Object.values(audioNodes).forEach((audioEl) => {
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
        }
      });
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const isSelectionMode = selectedMessageIds.length > 0;

  const toggleMessageSelection = (messageId) => {
    setSelectedMessageIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };

  const clearSelection = () => setSelectedMessageIds([]);

  const deleteSelectedMessages = () => {
    if (!selectedMessageIds.length) return;
    onDeleteMessages?.(selectedMessageIds);
    setSelectedMessageIds([]);
    setContextMenu(null);
  };

  const handleMessageContextMenu = (event, messageId) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      messageId,
    });
  };

  const handleLongPressStart = (event, messageId) => {
    if (event.pointerType !== "touch") return;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      toggleMessageSelection(messageId);
      setContextMenu(null);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const toggleAudioPlayback = async (messageId) => {
    const targetAudio = audioRefs.current[messageId];
    if (!targetAudio) return;

    if (playingAudioId === messageId && !targetAudio.paused) {
      targetAudio.pause();
      setPlayingAudioId(null);
      return;
    }

    Object.entries(audioRefs.current).forEach(([id, audioEl]) => {
      if (audioEl && id !== String(messageId) && !audioEl.paused) {
        audioEl.pause();
      }
    });

    try {
      await targetAudio.play();
      setPlayingAudioId(messageId);
    } catch {
      setPlayingAudioId(null);
    }
  };

  if (!chat) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b theme-border shrink-0 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="font-bold theme-text text-base">{chat.name}</h2>
          <p className="text-xs theme-text-muted mt-0.5">{chat.role}</p>
        </div>
        <button
          onClick={onBackToChats}
          className="md:hidden p-2 rounded-lg theme-hover-surface theme-text cursor-pointer"
          title="رجوع"
        >
          <ArrowForwardRoundedIcon fontSize="small" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-4 pb-28 space-y-2">
        {isSelectionMode && (
          <div className="sticky top-0 z-20 mb-2 flex items-center justify-between rounded-lg border theme-border theme-surface px-3 py-2">
            <p className="text-xs theme-text font-semibold">
              تم تحديد {selectedMessageIds.length} رسالة
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="px-2 py-1 rounded-md text-xs theme-text-muted theme-hover-surface cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={deleteSelectedMessages}
                className="px-2 py-1 rounded-md text-xs theme-text-danger theme-danger-soft cursor-pointer"
              >
                حذف المحدد
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            onContextMenu={(event) =>
              handleMessageContextMenu(event, message.id)
            }
            onPointerDown={(event) => handleLongPressStart(event, message.id)}
            onPointerUp={handleLongPressEnd}
            onPointerLeave={handleLongPressEnd}
            onClick={() => {
              if (!isSelectionMode) return;
              toggleMessageSelection(message.id);
            }}
            className={`flex items-end gap-2 ${
              message.direction === "outgoing" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 border text-sm transition-colors ${
                message.direction === "outgoing"
                  ? "theme-accent-soft border-transparent"
                  : "theme-surface-90 theme-border"
              } ${
                selectedMessageIds.includes(message.id)
                  ? "ring-2 ring-(--color-accent)"
                  : ""
              } ${isSelectionMode ? "cursor-pointer" : ""}`}
            >
              {message.type === "text" && (
                <p className="theme-text whitespace-pre-wrap leading-6 text-sm">
                  {message.text}
                </p>
              )}

              {message.type === "audio" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs theme-text-accent">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleAudioPlayback(message.id);
                      }}
                      className="w-8 h-8 rounded-full theme-accent theme-text-on-accent flex items-center justify-center cursor-pointer"
                      title={playingAudioId === message.id ? "إيقاف" : "تشغيل"}
                    >
                      {playingAudioId === message.id ? (
                        <PauseRoundedIcon fontSize="small" />
                      ) : (
                        <PlayArrowRoundedIcon fontSize="small" />
                      )}
                    </button>
                    <GraphicEqRoundedIcon fontSize="small" />
                    <span className="font-semibold">
                      {message.duration || "0:00"}
                    </span>
                  </div>

                  <audio
                    ref={(node) => {
                      if (node) {
                        audioRefs.current[message.id] = node;
                      }
                    }}
                    onEnded={() => setPlayingAudioId(null)}
                    onPause={() => {
                      const node = audioRefs.current[message.id];
                      if (node?.currentTime === node?.duration) return;
                      if (playingAudioId === message.id)
                        setPlayingAudioId(null);
                    }}
                    className="hidden"
                  >
                    <source src={message.url} type="audio/webm" />
                  </audio>
                </div>
              )}

              {message.type === "file" && isImageFile(message.fileType) && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={message.url}
                    alt="رسالة صورة"
                    className="max-w-xs max-h-64 object-cover hover:opacity-90 transition cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation();
                      setFullscreenImage(message.url);
                    }}
                  />
                  <p className="text-xs theme-text-muted mt-1">
                    {message.createdAt}
                  </p>
                </div>
              )}

              {message.type === "file" && !isImageFile(message.fileType) && (
                <a
                  href={message.url}
                  download={message.fileName}
                  className="flex items-center gap-2 p-2 rounded-lg theme-surface theme-hover-surface transition-colors cursor-pointer"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DescriptionRoundedIcon
                    fontSize="small"
                    className="theme-text-accent"
                  />
                  <div className="min-w-0">
                    <p className="theme-text text-xs truncate">
                      {message.fileName}
                    </p>
                    <p className="theme-text-muted text-[10px]">
                      {message.fileType || "ملف"}
                    </p>
                  </div>
                </a>
              )}

              {message.type !== "file" && (
                <p className="theme-text-muted text-[10px] mt-1">
                  {message.createdAt}
                </p>
              )}
            </div>

            {message.direction === "outgoing" && !isSelectionMode && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                className="p-1 rounded-lg theme-hover-danger theme-text-danger opacity-0 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                title="حذف"
              >
                <DeleteRoundedIcon fontSize="small" />
              </button>
            )}
          </div>
        ))}
      </div>

      <ChatComposer
        onSendText={onSendText}
        onSendFile={onSendFile}
        onSendAudio={onSendAudio}
      />

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              setFullscreenImage(null);
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
            title="إغلاق"
          >
            <CloseRoundedIcon />
          </button>
          <img
            src={fullscreenImage}
            alt="صورة بملء الشاشة"
            className="max-w-[90%] max-h-[90vh] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {contextMenu && (
        <div
          className="fixed z-50 rounded-lg border theme-border theme-surface shadow-lg p-1 min-w-36"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-right px-3 py-2 text-xs rounded-md theme-hover-surface cursor-pointer"
            onClick={() => {
              toggleMessageSelection(contextMenu.messageId);
              setContextMenu(null);
            }}
          >
            تحديد / إلغاء تحديد
          </button>
          <button
            type="button"
            className="w-full text-right px-3 py-2 text-xs rounded-md theme-hover-danger theme-text-danger cursor-pointer"
            onClick={() => {
              onDeleteMessage(contextMenu.messageId);
              setContextMenu(null);
            }}
          >
            حذف الرسالة
          </button>
          {selectedMessageIds.length > 0 && (
            <button
              type="button"
              className="w-full text-right px-3 py-2 text-xs rounded-md theme-hover-danger theme-text-danger cursor-pointer"
              onClick={deleteSelectedMessages}
            >
              حذف المحدد ({selectedMessageIds.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatThread;
