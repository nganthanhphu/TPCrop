import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Bot,
    X,
    Send,
    RotateCcw,
    Sprout,
    Loader2,
    ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { getCrops } from "@/services/cropService";
import { askChatbot } from "@/services/chatbotService";
import type { Crop } from "@/types/crop";
import type { ChatResponse } from "@/types/chatbot";

interface ChatMessage {
    id: string;
    sender: "user" | "bot";
    text: string;
}

export default function ChatbotPopup() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputQuestion, setInputQuestion] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const isFarmer = isAuthenticated && user?.role === "FARMER";

    const { data: cropsData, isLoading: isCropsLoading } = useQuery({
        queryKey: ["chatbotCrops"],
        queryFn: async () => {
            const res = await getCrops({ page: 0, size: 100 });
            return res.data;
        },
        enabled: isFarmer && isOpen,
    });

    const crops: Crop[] = cropsData?.content || [];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSelectCrop = (crop: Crop) => {
        if (!crop.isSupportChatbot) return;
        setSelectedCrop(crop);
        setMessages([
            {
                id: `bot-${crop.id}`,
                sender: "bot",
                text: `Xin chào! Tôi là trợ lý ảo nông nghiệp TPCrop. Bạn cần hỗ trợ gì về về cây ${crop.name}?`,
            },
        ]);
        setInputQuestion("");
    };

    const handleBackToCropSelection = () => {
        setSelectedCrop(null);
        setMessages([]);
        setInputQuestion("");
    };

    const askMutation = useMutation({
        mutationFn: async (question: string) => {
            const res = await askChatbot({ question });
            return res.data;
        },
        onSuccess: (data: ChatResponse) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-${prev.length}`,
                    sender: "bot",
                    text: data.response,
                },
            ]);
        },
        onError: () => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-err-${prev.length}`,
                    sender: "bot",
                    text: "Đã xảy ra lỗi. Vui lòng thử lại sau ít phút!",
                },
            ]);
        },
    });

    const handleSendMessage = (e?: React.SubmitEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const trimmed = inputQuestion.trim();
        if (!trimmed || askMutation.isPending) return;

        setMessages((prev) => [
            ...prev,
            {
                id: `user-${prev.length}`,
                sender: "user",
                text: trimmed,
            },
        ]);
        setInputQuestion("");
        askMutation.mutate(trimmed);
    };

    if (!isFarmer) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/35 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 group"
                    title="Trợ lý ảo nông nghiệp"
                >
                    <Bot className="w-7 h-7 transition-transform group-hover:rotate-6" />
                </button>
            )}

            {isOpen && (
                <div className="w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white px-5 py-4 flex items-center justify-between shadow-sm shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm leading-tight text-white">
                                    Trợ lý ảo TPCrop
                                </h3>
                                <p className="text-[11px] text-emerald-100 font-medium">
                                    {selectedCrop ? `Cây đã chọn: ${selectedCrop.name}` : "Tư vấn bệnh lý cây trồng"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {selectedCrop && (
                                <button
                                    type="button"
                                    onClick={handleBackToCropSelection}
                                    className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Đổi cây trồng khác"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="Đóng"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {!selectedCrop ? (
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col">
                            <div className="text-center mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                                    <Sprout className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">
                                    Chọn loại cây trồng cần tư vấn
                                </h4>
                            </div>

                            {isCropsLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
                                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                                    <span className="text-xs text-gray-400">Đang tải danh sách cây trồng...</span>
                                </div>
                            ) : crops.length === 0 ? (
                                <div className="text-center py-8 text-xs text-gray-400">
                                    Chưa có cây trồng nào trên hệ thống
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {crops.map((crop) => {
                                        const isSupported = Boolean(crop.isSupportChatbot);
                                        return (
                                            <div
                                                key={crop.id}
                                                onClick={() => isSupported && handleSelectCrop(crop)}
                                                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                                                    isSupported
                                                        ? "bg-white border-gray-200/90 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer shadow-xs hover:shadow-sm"
                                                        : "bg-gray-50/80 border-gray-200 opacity-45 cursor-not-allowed select-none"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                                            isSupported
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-gray-200 text-gray-400"
                                                        }`}
                                                    >
                                                        <Sprout className="w-4 h-4" />
                                                    </div>
                                                    <span
                                                        className={`text-sm font-bold ${
                                                            isSupported ? "text-gray-800" : "text-gray-400"
                                                        }`}
                                                    >
                                                        {crop.name}
                                                    </span>
                                                </div>

                                                <div>
                                                    {isSupported ? (
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <span className="text-[11px] font-medium text-gray-400">
                                                            Chưa hỗ trợ
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2.5 max-w-[85%] ${
                                            msg.sender === "user" ? "ml-auto justify-end" : "justify-start"
                                        }`}
                                    >
                                        {msg.sender === "bot" && (
                                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div
                                            className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                                msg.sender === "user"
                                                    ? "bg-emerald-600 text-white rounded-tr-xs shadow-sm shadow-emerald-600/20 font-medium"
                                                    : "bg-white text-gray-800 rounded-tl-xs border border-gray-200/80 shadow-xs"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {askMutation.isPending && (
                                    <div className="flex gap-2.5 max-w-[85%] justify-start">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="p-3 bg-white rounded-2xl rounded-tl-xs border border-gray-200/80 shadow-xs flex items-center gap-1.5 text-xs text-gray-400">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                                            <span>Đang suy nghĩ...</span>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
                            >
                                <input
                                    type="text"
                                    value={inputQuestion}
                                    onChange={(e) => setInputQuestion(e.target.value)}
                                    placeholder={`Hỏi về cây ${selectedCrop.name}...`}
                                    disabled={askMutation.isPending}
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputQuestion.trim() || askMutation.isPending}
                                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
                                    title="Gửi"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
