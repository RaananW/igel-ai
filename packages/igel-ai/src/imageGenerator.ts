import { IImageGeneratorImageToImageOptions, IImageGeneratorInpaintingOptions, IImageGeneratorPlugin, IImageGeneratorResponse, IImageGeneratorTextToImageOptions, IInjectedMethods, SupportedEngines } from "./interfaces";
// make node work in the browser
declare global {
    interface FormData {
        getHeaders: () => { [key: string]: string };
    }
}
FormData.prototype.getHeaders = () => {
    return { 'Content-Type': 'multipart/form-data' };
};
export class ImageGenerator {
    private _plugins: { [key in SupportedEngines]?: IImageGeneratorPlugin } = {};
    public disableAutoDownload: boolean = false;
    public transparentMode: boolean = true;
    /**
     * 
     * @param _injectedMethods injected methods, either from web or node environment
     */
    constructor(private _injectedMethods: IInjectedMethods) {
    }

    public addPlugin(plugin: IImageGeneratorPlugin) {
        this._plugins[plugin.name] = plugin;
        plugin.injectMethods(this._injectedMethods);

    };

    public removePlugin(engine: SupportedEngines) {
        delete this._plugins[engine];
    }
    async textToImage(prompt: string, options: IImageGeneratorTextToImageOptions, engine?: SupportedEngines): Promise<IImageGeneratorResponse> {
        return this.getPlugin(engine).textToImage(prompt, options);
    }
    async inpainting(prompt: string, options: IImageGeneratorInpaintingOptions, engine?: SupportedEngines): Promise<IImageGeneratorResponse> {
        return this.getPlugin(engine).inpainting(prompt, options);
    }
    async imageToImage(prompt: string, options: IImageGeneratorImageToImageOptions, engine?: SupportedEngines): Promise<IImageGeneratorResponse> {
        return this.getPlugin(engine).imageToImage(prompt, options);
    }

    private getPlugin(engine?: SupportedEngines): IImageGeneratorPlugin {
        if (Object.keys(this._plugins).length === 0) {
            throw new Error("No plugins registered");
        }
        if (!engine) {
            engine = Object.keys(this._plugins)[0] as SupportedEngines;
        }
        const plugin = this._plugins[engine];
        if (!plugin) {
            throw new Error(`No plugin registered for engine ${engine}`);
        }
        return plugin;
    }

}