import type { ChatRequest, ChatResponse } from "@/types/chatbot";
import { axiosClient } from "./axiosClient";
import endpoints from "./endpoints";
import type { AxiosPromise } from "axios";

export const askChatbot = (data: ChatRequest): AxiosPromise<ChatResponse> =>
    axiosClient.post(endpoints.chatbotAsk, data);
