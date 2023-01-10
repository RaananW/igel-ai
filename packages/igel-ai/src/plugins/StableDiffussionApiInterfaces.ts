export interface StableDiffusionTextToImageRequestBody {
    key: string;
    prompt: string;
    negative_prompt: string;
    samples: number;
    width: number;
    height: number;
    prompt_strength: string;
    num_inference_steps: number;
    guidance_scale: number;
    seed: string | null;
    webhook: string | null;
    track_id: string | null;
}

export interface StableDiffusionResponse {
    status: string;
    generationTime: number;
    id: number;
    output: string[],
    meta:  StableDiffusionResponseMetadata
}

export interface StableDiffusionResponseMetadata {
    H: number;
    W: number;
    enabled_attention_slicing: boolean;
    file_prefix: string;
    guidance_scale: number;
    model: string;
    n_samples: number,
    negative_prompt: string;
    outdir: string;
    prompt: string;
    revision: string;
    safety_checker: string;
    seed: number;
    steps: number;
    vae: string;
}