import { CreateImageRequest, CreateImageRequestSizeEnum, ImagesResponse, OpenAIApi } from "openai";
import { Configuration } from "openai";
import { AxiosResponse } from "axios";
import { IImageGeneratorImageToImageOptions, IImageGeneratorInpaintingOptions, IImageGeneratorPlugin, IImageGeneratorResponse, IImageGeneratorTextToImageOptions, IInjectedMethods, SupportedEngines } from "../interfaces";

export class OpenAIImageGeneratorPlugin implements IImageGeneratorPlugin {
    private _openai: OpenAIApi;
    private _injectedMethods?: IInjectedMethods;
    public readonly name = SupportedEngines.OPENNI;
    constructor(private _apiKey: string) {
        const configuration = new Configuration({
            apiKey: this._apiKey,
            baseOptions: {
                headers: {
                    "User-Agent": undefined
                }
            }
        });
        // browser support
        delete configuration.baseOptions.headers["User-Agent"];
        this._openai = new OpenAIApi(configuration);
    }
    public serialize(): { [key: string]: any; } {
        return {
            apiKey: this._apiKey
        }
    }
    public injectMethods(methods: IInjectedMethods) {
        this._injectedMethods = methods;
    }
    async textToImage(prompt: string, options: IImageGeneratorTextToImageOptions = {}): Promise<IImageGeneratorResponse> {
        const createImageRequest = this.generateImageRequest(prompt, options);
        // will throw an error if the request is invalid
        const response = await this._openai.createImage(createImageRequest);
        return this.responseToReturnFormat(response);

    }
    async inpainting(prompt: string, options: IImageGeneratorInpaintingOptions): Promise<IImageGeneratorResponse> {
        // image editing
        // we need the image! make sure we have it
        if (!options.image) {
            throw new Error("Image is required for image editing");
        }
        if (!this._injectedMethods || !this._injectedMethods.imageToFileObject) {
            throw new Error("Injected methods are not available");
        }
        // load the image

        const createImageRequest = this.generateImageRequest(prompt, options);

        const imageFile = await this._injectedMethods.imageToFileObject(options.image);

        const response = await this._openai.createImageEdit(
            imageFile,
            options.mask ? await this._injectedMethods.imageToFileObject(options.mask) : imageFile,
            prompt,
            createImageRequest.n ?? undefined,
            createImageRequest.size,
            createImageRequest.response_format
        );
        return this.responseToReturnFormat(response);

    }
    async imageToImage(prompt: string, options: IImageGeneratorImageToImageOptions): Promise<IImageGeneratorResponse> {
        // image variation
        // we need the image! make sure we have it
        if (!options.image) {
            throw new Error("Image is required for image editing");
        }
        if (!this._injectedMethods || !this._injectedMethods.imageToFileObject) {
            throw new Error("Injected methods are not available");
        }
        // load the image

        const createImageRequest = this.generateImageRequest(prompt, options);

        const imageFile = await this._injectedMethods.imageToFileObject(options.image);

        const response = await this._openai.createImageVariation(
            imageFile,
            createImageRequest.n ?? undefined,
            createImageRequest.size,
            createImageRequest.response_format
        );
        return this.responseToReturnFormat(response);
    }

    private generateImageRequest(prompt: string, options: IImageGeneratorTextToImageOptions) {
        const createImageRequest: CreateImageRequest = {
            prompt
        };
        if (options.resultsLength) {
            createImageRequest.n = options.resultsLength;
        }
        if (options.width || options.height) {
            if (options.width && options.height && options.width !== options.height) {
                console.log("Width and height should be equal. Using width value.");
                options.height = options.width;
            }
            if (options.width !== 1024 && options.width !== 512 && options.width !== 256) {
                console.log("Width should be 1024, 512 or 256. Using default value.");
                options.width = 1024;
            }
            createImageRequest.size = `${options.width}x${options.width}` as CreateImageRequestSizeEnum;
        }
        if (options.responseType) {
            createImageRequest.response_format = options.responseType === "base64" ? "b64_json" : "url";
        }
        return createImageRequest;
    }

    private responseToReturnFormat(response: AxiosResponse<ImagesResponse, any>) {
        return {
            images: response.data.data.map((image) => {
                return (image.b64_json || image.url) as string;
            })
        };
    }
}