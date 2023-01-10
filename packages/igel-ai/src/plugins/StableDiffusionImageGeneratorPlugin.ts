import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  IImageGeneratorImageToImageOptions,
  IImageGeneratorInpaintingOptions,
  IImageGeneratorPlugin,
  IImageGeneratorResponse,
  IImageGeneratorTextToImageOptions,
  IInjectedMethods,
  SupportedEngines,
} from "../interfaces";
import { StableDiffusionResponse, StableDiffusionTextToImageRequestBody } from "./StableDiffussionApiInterfaces";

export class StableDiffusionImageGeneratorPlugin implements IImageGeneratorPlugin
{
    private _injectedMethods?: IInjectedMethods;
    public readonly name = SupportedEngines.STABLEDIFFUSION;

    public constructor(private readonly _apiKey: string) {}

    public injectMethods(methods: IInjectedMethods): void {
        this._injectedMethods = methods;
    }

    public async textToImage(
        prompt: string,
        options: IImageGeneratorTextToImageOptions
    ): Promise<IImageGeneratorResponse> {
        const createImageRequest = this.generateTextToImageRequest(prompt, options);
        // will throw an error if the request is invalid
        const response = await axios.request(createImageRequest);
        return this.responseToReturnFormat(response);
    }

    inpainting(
        prompt: string,
        options: IImageGeneratorInpaintingOptions
    ): Promise<IImageGeneratorResponse> {
        throw new Error("Method not implemented.");
    }

    imageToImage(
        prompt?: string | undefined,
        options?: IImageGeneratorImageToImageOptions | undefined
    ): Promise<IImageGeneratorResponse> {
        throw new Error("Method not implemented.");
    }

    serialize(): { [key: string]: any } {
        throw new Error("Method not implemented.");
    }

    private generateTextToImageRequest(prompt: string, options: IImageGeneratorTextToImageOptions): AxiosRequestConfig<StableDiffusionTextToImageRequestBody> {
        if (options.width || options.height) {
            if (options.width && options.height && options.width !== options.height) {
                console.log("Width and height should be equal. Using width value.");
                options.height = options.width;
            }
            if (
                options.width !== 1024 &&
                options.width !== 512 &&
                options.width !== 256
            ) {
                console.log("Width should be 1024, 512 or 256. Using default value.");
                options.width = 1024;
            }
        }

        return {
            method: 'POST',
            url: 'https://stablediffusionapi.com/api/v3/text2img',
            data: {
                key: this._apiKey,
                prompt: prompt,
                negative_prompt: options.negativePrompt ?? '',
                samples: options.resultsLength ?? 1,
                width : options.width ?? 1024,
                height : options.height ?? 1024,
                prompt_strength : '',
                num_inference_steps : 20,
                guidance_scale: 7.5,
                seed: null, // random seed
                webhook: null,
                track_id: null
            },
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }

    private responseToReturnFormat(response: AxiosResponse<StableDiffusionResponse, any>): IImageGeneratorResponse {
        return {
            images: response.data.output,
            metadata: response.data.meta
        };
    }
}
