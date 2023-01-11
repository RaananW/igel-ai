export interface IDeepAIImageRequest {
    url: string;
    prompt: string;
    width?: number;
    height?: number;
}

export interface IDeepAIRequestBody {
    text: string;
    grid_size: "1" | "2";
    width: string;
    height: string;
    seed: string | null;
}

export interface IDeepAIResponse {
    status: string;
    generationTime: number;
    id: number;
    output: string[];
}