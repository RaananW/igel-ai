import { SupportedEngines } from "igel-ai";
import { useState } from "react";
import { Grid } from "./components/Grid";
import {
    imageGenerator,
    ImageGeneratorContext,
    registeredEngines,
} from "./ImageGeneratorContext";

function App() {
    const [enabledPlugins, setEnabledPlugins] = useState<SupportedEngines[]>(
        []
    );
    const [registeredPlugins, setRegisteredPlugins] =
        useState<SupportedEngines[]>(registeredEngines);

    return (
        <ImageGeneratorContext.Provider
            value={{
                registeredEngines: registeredPlugins,
                imageGenerator,
                enabledEngines: enabledPlugins,
                updateEnabledEngines: setEnabledPlugins,
                updateRegisteredEngines: setRegisteredPlugins,
            }}
        >
            <div className="App">
                <Grid></Grid>
            </div>
        </ImageGeneratorContext.Provider>
    );
}

export default App;
