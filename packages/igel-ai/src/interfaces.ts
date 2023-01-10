/**
 * Defines the needed functionality from a image generator plugin.
 * If the API is missing one of the methods, it should throw.
 */
export interface IImageGeneratorPlugin {
    readonly name: SupportedEngines;
    injectMethods(methods: IInjectedMethods): void;
    textToImage(prompt: string, options?: IImageGeneratorTextToImageOptions): Promise<IImageGeneratorResponse>;
    inpainting(prompt: string, options: IImageGeneratorInpaintingOptions): Promise<IImageGeneratorResponse>;
    imageToImage(prompt?: string, options?: IImageGeneratorImageToImageOptions): Promise<IImageGeneratorResponse>;
    serialize(): { [key: string]: any };
}

/**
 * A fixed list of APIs supported. 
 * When adding a new plugin make sure you add them here.
 */
export enum SupportedEngines {
    OPENNI = "openni"
}

/**
 * The required data to generate an image from text.
 * Some APIs may not support all of these options, and some APIs will require more.
 * If the API requires one of those and they are not available, it should throw.
 */
export interface IImageGeneratorTextToImageOptions {
    width?: number;
    height?: number;
    responseType?: 'base64' | 'buffer';
    resultsLength?: number;
    requestIdentifier?: string;
}

/**
 * The options requires to generate image-to-image (image variations)
 */
export interface IImageGeneratorImageToImageOptions extends IImageGeneratorTextToImageOptions {
    /**
     * Either a URL of an image or an array buffer of a loaded image.
     * Some APIs do not support ArrayBuffer. If an ArrayBuffer is provided it should throw.
     */
    image: string | ArrayBuffer;
}

/**
 * The options requires to generate inpainting (image editing)
 */
export interface IImageGeneratorInpaintingOptions extends IImageGeneratorImageToImageOptions {
    /**
     * An optional edit mask (an image containing transparent parts that will be used during the editing process)
     * If not provided the image will be used. Image is then expected to have an alpha channel.
     */
    mask?: string | ArrayBuffer;
}

/**
 * A simple response of a successful image generation request.
 */
export interface IImageGeneratorResponse {
    /**
     * An array of results. The length of the array is determined by the resultsLength option (if the API supports it).
     */
    images: string[]; // base64 encoded image or a list of urls
    /**
     * Any metadata provided by the ai engine that might be useful to the user.
     * Engine-specific.
     */
    metadata?: any;
}

/**
 * This interface defines the list of functions that needs to be injected to the plugin to work with files correctly.
 * The idea is to support different environments.
 * The dev will need to load the right methods and inject them when initializing the package.
 */
export interface IInjectedMethods {
    /**
     * Save a file locally. On the web it would trigger a download. In node it will save the file on the file system.
     * @param url the URL/Base64 Data URL to save
     * @param filename The filename that will be used to save the file
     * @returns nada!
     */
    saveFile?: (url: string, filename: string) => void;
    /**
     * Load a URL to a data url or an array buffer.
     * @param url the URL to load
     * @param base64 Should the result be basee64? when false it will be an array buffer
     * @returns Either the data URL or the array buffer
     */
    loadFile?: (url: string, base64?: boolean) => Promise<string | ArrayBuffer>;
    /**
     * Generate a File object from image data.
     * The reason that the File object is being used is because most APIs accept the File Object.
     * Note - this might change in the future, as Node.js doesn't support the File API.
     *
     * @param image The image data. Either a data URL or an array buffer
     * @returns A promise that resolves with a File Object
     */
    imageToFileObject?: (image: string | ArrayBuffer) => Promise<File>;
}