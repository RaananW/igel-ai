import { createContext } from "react";
import { ImageGenerator,  } from "igel-ai";
import { SupportedEngines } from "igel-ai";
import { loadFile, saveFile, imageToFileObject } from "igel-ai/dist/web";

export const imageGenerator = new ImageGenerator({
    loadFile,
    saveFile,
    imageToFileObject
});

const registeredEngines: SupportedEngines[] = []; // = ["openai", "deepai", "stablediffusionapi"];

export const ImageGeneratorContext = createContext({
    imageGenerator,
    registeredEngines
});