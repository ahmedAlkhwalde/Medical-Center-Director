import { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendAudioMessage,
  sendFileMessage,
  sendTextMessage,
  deleteMessage,
} from "../../features/chat/chatSlice";
import ChatsList from "./components/ChatsList";
import ChatThread from "./components/ChatThread";

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { chats, messagesByChatId } = useSelector((state) => state.chat);

  const activeChatId = useMemo(() => {
    const parsed = Number(chatId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [chatId]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || null,
    [chats, activeChatId],
  );

  const messages = activeChat
    ? messagesByChatId[String(activeChat.id)] || []
    : [];

  const handleSelectChat = (id) => navigate(`/main-page/chat/${id}`);
  const handleSendText = (text) => {
    if (!activeChat) return;
    dispatch(sendTextMessage({ chatId: activeChat.id, text }));
  };

  const handleSendFile = (filePayload) => {
    if (!activeChat) return;
    dispatch(sendFileMessage({ chatId: activeChat.id, ...filePayload }));
  };

  const handleSendAudio = (audioPayload) => {
    if (!activeChat) return;
    dispatch(sendAudioMessage({ chatId: activeChat.id, ...audioPayload }));
  };

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage({ chatId: activeChatId, messageId }));
  };

  const handleDeleteMessages = (messageIds) => {
    if (!Array.isArray(messageIds) || !messageIds.length) return;
    messageIds.forEach((messageId) => {
      dispatch(deleteMessage({ chatId: activeChatId, messageId }));
    });
  };

  const handleBackToChats = () => navigate("/main-page/chat");

  return (
    <div className="h-[calc(100vh-110px)] min-h-[calc(100vh-110px)] flex gap-0 bg-transparent p-0 overflow-hidden">
      <div className={`border-l theme-border theme-surface flex flex-col overflow-hidden min-h-0 ${
        activeChatId ? "hidden md:flex" : "flex"
      } md:w-80 w-full`}>
        <div className="px-4 py-4 border-b theme-border shrink-0">
          <h2 className="text-base font-bold theme-text">الدردشات</h2>
        </div>
        <ChatsList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className={`${
        activeChatId ? "flex" : "hidden md:flex"
      } flex-1 flex flex-col min-w-0 min-h-0`}>
        {activeChat ? (
          <ChatThread
            chat={activeChat}
            messages={messages}
            onSendText={handleSendText}
            onSendFile={handleSendFile}
            onSendAudio={handleSendAudio}
            onDeleteMessage={handleDeleteMessage}
            onDeleteMessages={handleDeleteMessages}
            onBackToChats={handleBackToChats}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center theme-bg">
            <p className="theme-text-muted text-sm">اختر محادثة من القائمة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
