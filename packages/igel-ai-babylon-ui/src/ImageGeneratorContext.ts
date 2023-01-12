import { createContext, Dispatch, SetStateAction } from "react";
import { ImageGenerator, Parse } from "igel-ai";
import { SupportedEngines } from "igel-ai";
import { loadFile, saveFile, imageToFileObject } from "igel-ai/dist/web";

export const imageGenerator = new ImageGenerator({
    loadFile,
    saveFile,
    imageToFileObject,
});

const fromLocalStorage = localStorage.getItem("engines");
export const registeredEngines: SupportedEngines[] = fromLocalStorage
    ? (JSON.parse(fromLocalStorage) as SupportedEngines[])
    : [];

registeredEngines.forEach((engine) => {
    const data = localStorage.getItem(engine as string);
    if (!data) {
        return;
    }
    Parse(engine, JSON.parse(data) as { [key: string]: unknown }).then(
        (plugin) => {
            imageGenerator.addPlugin(plugin);
        },
        (err) => {
            console.error(err);
        }
    );
});

export const ImageGeneratorContext = createContext<{
    imageGenerator: ImageGenerator;
    registeredEngines: SupportedEngines[];
    updateRegisteredEngines: Dispatch<SetStateAction<SupportedEngines[]>>;
    enabledEngines: SupportedEngines[];
    updateEnabledEngines: Dispatch<SetStateAction<SupportedEngines[]>>;
    generatedImages: string[];
    updateGeneratedImages: Dispatch<SetStateAction<string[]>>;
    selectedImage: string;
    setSelectedImage: Dispatch<SetStateAction<string>>;
}>({
    imageGenerator,
    registeredEngines,
    updateRegisteredEngines: () => {
        /* no-op */
    },
    enabledEngines: [] as SupportedEngines[],
    updateEnabledEngines: () => {
        /* no-op */
    },
    generatedImages: [] as string[],
    updateGeneratedImages: () => {
        /* no-op */
    },
    selectedImage: "",
    setSelectedImage: () => {
        /* no-op */
    }
});
