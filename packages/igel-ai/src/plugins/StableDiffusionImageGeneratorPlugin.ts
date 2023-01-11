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
import {
    IStableDiffusionImageRequest,
    IStableDiffusionRequestBody,
    IStableDiffusionResponse,
} from "./StableDiffussionApiInterfaces";

export class StableDiffusionImageGeneratorPlugin
    implements IImageGeneratorPlugin
{
    public readonly name = SupportedEngines.STABLEDIFFUSION;

    public constructor(private readonly _apiKey: string) {}

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
        const response = await axios.request<IStableDiffusionResponse>(
            createImageRequest
        );
        return this.responseToReturnFormat(response);
    }

    public async imageToImage(
        prompt: string,
        options: IImageGeneratorImageToImageOptions
    ): Promise<IImageGeneratorResponse> {
        if (
            !options.image ||
            !StableDiffusionImageGeneratorPlugin.isString(options.image)
        ) {
            throw new Error(
                "Image URL is required for image to image generation"
            );
        }

        const createImageRequest = this.generateImageToImageRequest(
            prompt,
            options
        );

        // will throw an error if the request is invalid
        const response = await axios.request<IStableDiffusionResponse>(
            createImageRequest
        );
        return this.responseToReturnFormat(response);
    }

    public async inpainting(
        prompt: string,
        options: IImageGeneratorInpaintingOptions
    ): Promise<IImageGeneratorResponse> {
        if (
            !options.mask ||
            !StableDiffusionImageGeneratorPlugin.isString(options.mask)
        ) {
            throw new Error(
                "Image URL is required for image to image generation"
            );
        }

        const createImageRequest = this.generateInpaintRequest(prompt, options);

        // will throw an error if the request is invalid
        const response = await axios.request<IStableDiffusionResponse>(
            createImageRequest
        );
        return this.responseToReturnFormat(response);
    }

    public serialize(): { [key: string]: any } {
        return {
            apiKey: this._apiKey,
        };
    }

    private generateTextToImageRequest(
        prompt: string,
        options: IImageGeneratorTextToImageOptions
    ): AxiosRequestConfig<IStableDiffusionRequestBody> {
        return this.generateImageRequest({
            prompt,
            url: "https://stablediffusionapi.com/api/v3/text2img",
            ...options,
        });
    }

    private generateImageToImageRequest(
        prompt: string,
        options: IImageGeneratorImageToImageOptions
    ): AxiosRequestConfig<IStableDiffusionRequestBody> {
        const { image, ...optionsWithoutImage } = options;
        return this.generateImageRequest({
            prompt,
            url: "https://stablediffusionapi.com/api/v3/img2img",
            image: image as any as string,
            ...optionsWithoutImage,
        });
    }

    private generateInpaintRequest(
        prompt: string,
        options: IImageGeneratorInpaintingOptions
    ): AxiosRequestConfig<IStableDiffusionRequestBody> {
        const { image: _image, mask, ...optionsWithoutMask } = options;
        return this.generateImageRequest({
            prompt,
            url: "https://stablediffusionapi.com/api/v3/inpaint",
            mask: mask as unknown as string,
            ...optionsWithoutMask,
        });
    }

    private generateImageRequest(
        options: IStableDiffusionImageRequest
    ): AxiosRequestConfig<IStableDiffusionRequestBody> {
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
            if (
                options.width !== 1024 &&
                options.width !== 512 &&
                options.width !== 256
            ) {
                console.log(
                    "Width should be 1024, 512 or 256. Using default value."
                );
                options.width = 1024;
            }
        }

        return {
            method: "POST",
            url: options.url,
            data: {
                key: this._apiKey,
                prompt: options.prompt,
                negative_prompt: options.negativePrompt ?? "",
                init_image: (options.image as string) ?? null,
                mask_image: (options.mask as string) ?? null,
                samples: options.resultsLength ?? 1,
                width: options.width ?? 1024,
                height: options.height ?? 1024,
                prompt_strength: 1,
                num_inference_steps: 20,
                guidance_scale: 7.5,
                seed: null, // random seed
                webhook: null,
                track_id: options.requestIdentifier ?? null,
            },
            headers: {
                "Content-Type": "application/json",
            },
        };
    }

    private responseToReturnFormat(
        response: AxiosResponse<IStableDiffusionResponse, any>
    ): IImageGeneratorResponse {
        return {
            images: response.data.output,
            metadata: response.data.meta,
        };
    }

    private static isString(obj: unknown): obj is string {
        return typeof obj === "string";
    }
}
