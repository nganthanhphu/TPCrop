export interface Crop {
    id: number;
    name: string;
    isSupportChatbot: boolean;
}

export interface CropCreate {
    name: string;
}

export interface CropUpdate {
    name?: string;
    isSupportChatbot?: boolean;
}
