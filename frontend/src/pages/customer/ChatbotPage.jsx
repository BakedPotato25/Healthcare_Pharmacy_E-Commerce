import { useState } from "react";
import { ImagePlus, Info, Send, Sparkles } from "lucide-react";
import { sendChatMessage } from "../../api/chatApi.js";
import AppHeader from "../../components/customer/AppHeader.jsx";
import ChatMessageBubble from "../../components/customer/ChatMessageBubble.jsx";
import { chatMessages, categories } from "../../data/customerMockData.js";

export default function ChatbotPage() {
  const [messages, setMessages] = useState(chatMessages);
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("Using fallback demo chat until /api/chat/ is implemented by chatbot_service.");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) {
      return;
    }

    setMessages((current) => [...current, { sender: "user", text: trimmedMessage }]);
    setMessageText("");
    setIsSending(true);
    try {
      const response = await sendChatMessage(trimmedMessage);
      setMessages((current) => [
        ...current,
        {
          sender: "assistant",
          text: response.response || response.message || response.answer || "I can provide general product guidance only.",
        },
      ]);
      setNotice("");
    } catch {
      setMessages((current) => [
        ...current,
        {
          sender: "assistant",
          text: "The chatbot API is unavailable, so this is a safe fallback response. For general product guidance, browse categories such as vitamins, skincare, oral care, first aid, and digestive health. This does not replace advice from a doctor or pharmacist.",
        },
      ]);
      setNotice("Using fallback demo chat because the API Gateway or chatbot endpoint is unavailable.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-pharmacare-bg">
      <AppHeader />
      <div className="border-b border-pharmacare-line bg-pharmacare-secondarySoft px-4 py-3 text-pharmacare-secondary">
        <div className="mx-auto flex max-w-7xl items-start justify-center gap-2 text-sm leading-6">
          <Info className="mt-0.5 shrink-0" size={18} />
          <p>
            <strong>Medical safety disclaimer:</strong> This assistant provides general product information only. It does not diagnose conditions, replace doctor or pharmacist advice, or provide emergency instructions.
          </p>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-116px)] w-full max-w-7xl flex-1 bg-white">
        <aside className="hidden w-72 shrink-0 border-r border-pharmacare-line bg-pharmacare-low p-5 lg:block">
          <h2 className="text-lg font-semibold text-pharmacare-ink">Consultation Topics</h2>
          <p className="mt-2 text-sm leading-6 text-pharmacare-muted">Choose a general product area to guide the conversation.</p>
          <div className="mt-5 space-y-2">
            {categories.slice(0, 7).map((category, index) => {
              const Icon = category.icon;
              return (
                <button key={category.name} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${index === 0 ? "bg-white text-pharmacare-primary shadow-soft" : "text-pharmacare-muted hover:bg-white"}`}>
                  <Icon size={18} />
                  {category.name}
                </button>
              );
            })}
          </div>
          <div className="mt-8 rounded-xl border border-pharmacare-line bg-white p-4">
            <Sparkles className="text-pharmacare-primary" size={20} />
            <p className="mt-3 text-sm font-semibold text-pharmacare-ink">Safe product guidance</p>
            <p className="mt-1 text-sm leading-6 text-pharmacare-muted">The final version will use trained model artifacts and safe fallback responses.</p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-pharmacare-line bg-white p-4 lg:hidden">
            <h1 className="text-xl font-semibold text-pharmacare-ink">AI Health Consultant</h1>
          </div>
          <section className="flex-1 space-y-5 overflow-y-auto bg-white p-4 sm:p-6">
            {notice ? <p className="rounded-xl bg-pharmacare-warningSoft px-4 py-3 text-sm font-medium text-pharmacare-warning">{notice}</p> : null}
            <div className="text-center">
              <span className="rounded-full bg-pharmacare-low px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pharmacare-muted">
                Today, 10:42 AM
              </span>
            </div>
            <div className="flex flex-col gap-5">
              {messages.map((message, index) => (
                <ChatMessageBubble key={`${message.sender}-${index}`} message={message} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pl-14">
              {["How often should I apply it?", "What if it does not improve?", "Show skincare products"].map((prompt) => (
                <button key={prompt} className="rounded-full border border-pharmacare-line bg-white px-4 py-2 text-sm font-medium text-pharmacare-muted shadow-soft hover:bg-pharmacare-low" onClick={() => setMessageText(prompt)} type="button">
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <section className="border-t border-pharmacare-line bg-white p-4">
            <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-pharmacare-line bg-pharmacare-low p-2 focus-within:border-pharmacare-primary focus-within:ring-2 focus-within:ring-pharmacare-primary/10">
              <button className="rounded-full p-2 text-pharmacare-muted hover:text-pharmacare-primary" aria-label="Attach image">
                <ImagePlus size={20} />
              </button>
              <textarea className="max-h-28 min-h-11 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-sm text-pharmacare-ink outline-none placeholder:text-pharmacare-muted focus:ring-0" onChange={(event) => setMessageText(event.target.value)} onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }} placeholder="Type your general health or product question here..." rows="1" value={messageText} />
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pharmacare-primary text-white hover:bg-pharmacare-primaryHover disabled:cursor-not-allowed disabled:opacity-60" aria-label="Send message" disabled={isSending} onClick={handleSend} type="button">
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-pharmacare-muted">AI can make mistakes. Verify important information with a pharmacist or doctor.</p>
          </section>
        </main>
      </div>
    </div>
  );
}
