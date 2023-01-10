import { IImageGeneratorPlugin, SupportedEngines } from "../interfaces";

export async function Parse(key: SupportedEngines, payload: { [key: string]: any }): Promise<IImageGeneratorPlugin> {
    switch (key) {
        case SupportedEngines.OPENNI:
            return new (await import("./OpenAIImageGeneratorPlugin")).OpenAIImageGeneratorPlugin(payload.apiKey);
    }
}