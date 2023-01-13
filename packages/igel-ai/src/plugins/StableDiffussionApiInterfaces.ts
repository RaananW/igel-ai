export interface IStableDiffusionImageRequest {
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

export interface IStableDiffusionRequestBody {
    key: string;
    prompt: string;
    negative_prompt: string;
    init_image: string | null;
    mask_image: string | null;
    samples: number;
    width: number;
    height: number;
    strength: number;
    num_inference_steps: number;
    guidance_scale: number;
    seed: string | null;
    webhook: string | null;
    track_id: string | null;
}

export interface IStableDiffusionResponse {
    status: string;
    generationTime: number;
    id: number;
    output: string[];
    meta: IStableDiffusionResponseMetadata;
}

export interface IStableDiffusionResponseMetadata {
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
