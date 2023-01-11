import { SupportedEngines } from "igel-ai";
import { useState } from "react";
import { Grid } from "./components/Grid";
import {
    imageGenerator,
    ImageGeneratorContext,
    registeredEngines,
} from "./ImageGeneratorContext";
import "./App.css";

function App() {
    const [enabledEngines, updateEnabledEngines] = useState<SupportedEngines[]>(
        registeredEngines
    );
    const [registeredPlugins, setRegisteredPlugins] =
        useState<SupportedEngines[]>(registeredEngines);
    const [generatedImages, updateGeneratedImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>("");

    return (
        <ImageGeneratorContext.Provider
            value={{
                registeredEngines: registeredPlugins,
                imageGenerator,
                enabledEngines,
                updateEnabledEngines,
                updateRegisteredEngines: setRegisteredPlugins,
                generatedImages,
                updateGeneratedImages,
                selectedImage,
                setSelectedImage,
            }}
        >
            <div className="App">
                <Grid></Grid>
            </div>
        </ImageGeneratorContext.Provider>
    );
}

export default App;
