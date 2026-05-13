import { Bot, UserRound } from "lucide-react";
import RecommendedProductCard from "./RecommendedProductCard.jsx";

export default function ChatMessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse self-end" : "self-start"} max-w-full`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isUser ? "bg-pharmacare-low text-pharmacare-muted" : "bg-pharmacare-primary text-white"}`}>
        {isUser ? <UserRound size={19} /> : <Bot size={19} />}
      </div>
      <div className={`max-w-3xl rounded-2xl border p-4 shadow-soft ${isUser ? "rounded-tr-sm border-pharmacare-primary bg-pharmacare-primary text-white" : "rounded-tl-sm border-pharmacare-line bg-pharmacare-low text-pharmacare-ink"}`}>
        <p className="text-sm leading-6 sm:text-base">{message.text}</p>
        {message.recommendations ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {message.recommendations.map((product) => (
              <RecommendedProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
