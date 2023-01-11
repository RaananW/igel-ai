import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
    IImageGeneratorImageToImageOptions,
    IImageGeneratorInpaintingOptions,
    IImageGeneratorPlugin,
    IImageGeneratorResponse,
    IImageGeneratorTextToImageOptions,
    IInjectedMethods,
    SupportedEngines,
} from "../interfaces";
import { IDeepAIImageRequest, IDeepAIRequestBody, IDeepAIResponse } from "./DeepAIApiInterfaces";

export class DeepAIImageGeneratorPlugin
    implements IImageGeneratorPlugin
{
    public readonly name = SupportedEngines.DEEPAI;

    public constructor(private readonly _apiKey: string) { }

    public injectMethods(_methods: IInjectedMethods): void {
        // Not used for Stable Diffusion API
    }

    public async textToImage(
        prompt: string,
        options: IImageGeneratorTextToImageOptions
    ): Promise<IImageGeneratorResponse> {
        const createImageRequest = this.generateTextToImageRequest(
            prompt,
            options
        );

        // will throw an error if the request is invalid
        const response = await axios.request<IDeepAIResponse>(
            createImageRequest
        );
        return this.responseToReturnFormat(response);
    }

    public imageToImage(
        prompt: string,
        options: IImageGeneratorImageToImageOptions
    ): Promise<IImageGeneratorResponse> {
        throw new Error("Not implemented");
    }

    public inpainting(
        prompt: string,
        options: IImageGeneratorInpaintingOptions
    ): Promise<IImageGeneratorResponse> {
        throw new Error("Not implemented");
    }

    public serialize(): { [key: string]: any } {
        return {
            apiKey: this._apiKey,
        };
    }

    private generateTextToImageRequest(
        prompt: string,
        options: IImageGeneratorTextToImageOptions
    ): AxiosRequestConfig<IDeepAIRequestBody> {
        return this.generateImageRequest({
            url: "https://api.deepai.org/api/text2img",
            prompt,
            ...options,
        });
    }

    private generateImageRequest(
        options: IDeepAIImageRequest
    ): AxiosRequestConfig<IDeepAIRequestBody> {
        if (options.width || options.height) {
            if (
                options.width &&
                options.height &&
                options.width !== options.height
            ) {
                console.log(
                    "Width and height should be equal. Using width value."
                );
                options.height = options.width;
            }
            if (!options.width || options.width % 128 !== 0) {
                console.log(
                    "Width should be a multiple of 128 between 128 and 1536. Using default value (1024)."
                );
                options.width = 1024;
            }
        }

        return {
            method: "POST",
            url: options.url,
            data: {
                text: options.prompt,
                grid_size: "1",
                width: options?.width?.toString() ?? "1024",
                height: options?.height?.toString() ?? "1024",
                seed: null, // random seed
            },
            headers: {
                "api-key": this._apiKey,
            },
        };
    }

    private responseToReturnFormat(
        response: AxiosResponse<IDeepAIResponse, any>
    ): IImageGeneratorResponse {
        return {
            images: response.data.output
        };
    }
}
