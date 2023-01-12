import { IImageGeneratorPlugin, SupportedEngines } from "../interfaces";

export async function Parse(
    key: SupportedEngines,
    payload: { [key: string]: unknown }
): Promise<IImageGeneratorPlugin> {
    switch (key) {
        case SupportedEngines.OPENNI:
            return new (
                await import("./OpenAIImageGeneratorPlugin")
            ).OpenAIImageGeneratorPlugin(payload.apiKey as string);
        case SupportedEngines.STABLEDIFFUSION:
            return new (
                await import("./StableDiffusionImageGeneratorPlugin")
            ).StableDiffusionImageGeneratorPlugin(payload.apiKey as string);
        case SupportedEngines.DEEPAI:
            return new (
                await import("./DeepAIImageGeneratorPlugin")
            ).DeepAIImageGeneratorPlugin(payload.apiKey as string);
        default:
            throw new Error("Invalid engine");
    }
}
