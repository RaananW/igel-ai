export interface IDeepAIImageRequest {
    prompt: string;
    url: string;
    width?: number;
    height?: number;
    resultsLength?: number;
    requestIdentifier?: string;
    negativePrompt?: string;
    image?: string;
    mask?: string;
}

export interface IDeepAIRequestBody {
    key: string;
    prompt: string;
    negative_prompt: string;
    init_image: string | null;
    mask_image: string | null;
    samples: number;
    width: number;
    height: number;
    prompt_strength: number;
    num_inference_steps: number;
    guidance_scale: number;
    seed: string | null;
    webhook: string | null;
    track_id: string | null;
}

export interface IDeepAIResponse {
    status: string;
    generationTime: number;
    id: number;
    output: string[];
    meta: IDeepAIResponseMetadata;
}

export interface IDeepAIResponseMetadata {
    H: number;
    W: number;
    enabled_attention_slicing: boolean;
    file_prefix: string;
    guidance_scale: number;
    model: string;
    n_samples: number;
    negative_prompt: string;
    outdir: string;
    prompt: string;
    revision: string;
    safety_checker: string;
    seed: number;
    steps: number;
    vae: string;
}
