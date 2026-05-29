import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";

const ChatComposer = ({ onSendText, onSendFile, onSendAudio }) => {
  const [draft, setDraft] = useState("");
  const [pickedFile, setPickedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sendText = () => {
    const text = draft.trim();
    if (!text) return;
    onSendText(text);
    setDraft("");
  };

  const sendFile = () => {
    if (!pickedFile) return;
    const url = URL.createObjectURL(pickedFile);
    onSendFile({
      fileName: pickedFile.name,
      fileType: pickedFile.type,
      fileSize: `${(pickedFile.size / 1024).toFixed(1)} KB`,
      url,
    });
    setPickedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const duration = formatDuration(recordingSeconds);
        onSendAudio({ url, duration });
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      };

      mr.start();
      setIsRecording(true);
    } catch (_err) {
      onSendText("تعذر بدء التسجيل الصوتي. يرجى السماح باستخدام المايكروفون.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMainAction = () => {
    const hasText = draft.trim().length > 0;
    const hasFile = !!pickedFile;

    if (hasFile) sendFile();
    if (hasText) sendText();

    if (!hasText && !hasFile) {
      if (isRecording) stopRecording();
      else startRecording();
    }
  };

  return (
    <div
      className={`sticky bottom-0 z-10 border-t theme-border p-3 sm:p-4 shrink-0 ${
      isRecording ? "bg-red-50 dark:bg-red-900/10" : ""
    }`}
  
    >
      {isRecording && (
        <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg theme-danger-soft">
          <Motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full theme-text-danger"
          />
          <span className="text-xs theme-text-danger font-medium">
            جاري التسجيل: {formatDuration(recordingSeconds)}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setPickedFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecording}
          className="p-2 rounded-lg border theme-border theme-hover-surface theme-text disabled:opacity-50 cursor-pointer"
          title="إرفاق ملف"
        >
          <AttachFileRoundedIcon fontSize="small" />
        </button>

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleMainAction();
            }
          }}
          disabled={isRecording}
          placeholder="اكتب رسالة..."
          className="flex-1 rounded-lg border theme-border bg-transparent theme-text px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--color-accent) disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleMainAction}
          className={`ml-2 p-2.5 rounded-lg flex items-center justify-center cursor-pointer ${
            draft.trim().length > 0 || pickedFile
              ? "theme-accent theme-text-on-accent"
              : isRecording
                ? "theme-text-danger theme-danger-soft"
                : "theme-border theme-text"
          }`}
          title={
            draft.trim().length > 0 || pickedFile
              ? "إرسال"
              : isRecording
                ? "إيقاف"
                : "تسجيل"
          }
        >
          {draft.trim().length > 0 || pickedFile ? (
            <SendRoundedIcon fontSize="small" />
          ) : isRecording ? (
            <StopCircleRoundedIcon fontSize="small" />
          ) : (
            <MicRoundedIcon fontSize="small" />
          )}
        </button>
      </div>

      {pickedFile && (
        <p className="text-xs theme-text-muted mt-2 truncate">
          الملف المحدد: {pickedFile.name}
        </p>
      )}
    </div>
  );
};

export default ChatComposer;
