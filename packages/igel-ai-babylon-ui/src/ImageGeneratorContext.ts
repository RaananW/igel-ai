import { createContext, Dispatch, SetStateAction } from "react";
import { ImageGenerator, Parse, } from "igel-ai";
import { SupportedEngines } from "igel-ai";
import { loadFile, saveFile, imageToFileObject } from "igel-ai/dist/web";

export const imageGenerator = new ImageGenerator({
    loadFile,
    saveFile,
    imageToFileObject
});

export const registeredEngines: SupportedEngines[] = localStorage.getItem("engines") ? JSON.parse(localStorage.getItem("engines")!) : [];

registeredEngines.forEach((engine) => {
    const data = localStorage.getItem(engine as string);
    if (!data) {
        return;
    }
    Parse(engine, JSON.parse(data) as { [key: string]: any }).then((plugin) => {
        imageGenerator.addPlugin(plugin);
    });
});

export const ImageGeneratorContext = createContext<{
    imageGenerator: ImageGenerator;
    registeredEngines: SupportedEngines[];
    updateRegisteredEngines: Dispatch<SetStateAction<SupportedEngines[]>>;
    enabledEngines: SupportedEngines[];
    updateEnabledEngines: Dispatch<SetStateAction<SupportedEngines[]>>;
}>({
    imageGenerator,
    registeredEngines,
    updateRegisteredEngines: () => { },
    enabledEngines: [] as SupportedEngines[],
    updateEnabledEngines: () => { },
});