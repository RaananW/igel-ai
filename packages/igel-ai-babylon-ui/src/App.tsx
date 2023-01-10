import { SupportedEngines } from "igel-ai";
import { useState } from "react";
import { Grid } from "./components/Grid";
import {
  imageGenerator,
  ImageGeneratorContext,
  registeredEngines,
} from "./ImageGeneratorContext";

function App() {
  const [enabledPlugins, setEnabledPlugins] = useState<SupportedEngines[]>([]);
  const [registeredPlugins, setRegisteredPlugins] =
    useState<SupportedEngines[]>(registeredEngines);
  // const [engines, setEngines] = useState<SupportedEngines[]>(registeredEngines);
  // // DEBUGGING! Should not be here
  // const [apiKey, setApiKey] = useState<string>("");
  // const [prompt, setPrompt] = useState<string>("");
  // const [image, setImage] = useState<string>("");
  // const [variation, setVariation] = useState<string>("");
  // const [variationURL, setVariationURL] = useState<string>("");
  // const addEngine = () => {
  //   if (engines.includes(SupportedEngines.OPENNI) || !apiKey) return;
  //   const newEngine = new OpenAIImageGeneratorPlugin(apiKey);
  //   imageGenerator.addPlugin(newEngine);
  //   setEngines([...engines, newEngine.name]);
  //   // store in localStorage
  //   localStorage.setItem(
  //     "engines",
  //     JSON.stringify([...engines, newEngine.name])
  //   );
  //   localStorage.setItem(newEngine.name, JSON.stringify(newEngine.serialize()));
  // };
  // const generate = () => {
  //   if (variationURL) {
  //     if (prompt) {
  //       imageGenerator
  //         .inpainting(prompt, {
  //           image: variationURL,
  //           mask: variationURL,
  //         })
  //         .then((res) => {
  //           console.log(res);
  //           setVariation(res.images[0]);
  //         });
  //     } else {
  //       imageGenerator
  //         .imageToImage("", {
  //           image: variationURL,
  //         })
  //         .then((res) => {
  //           console.log(res);
  //           setVariation(res.images[0]);
  //         });
  //     }
  //   } else {
  //     imageGenerator
  //       .textToImage(prompt, {
  //         // responseType: "base64",
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         // setImage(`data:image/png;base64,${res.images[0]}`);
  //         setImage(res.images[0]);
  //       });
  //   }
  // };
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
        {/* <Stack>
          <TextField
            label="API Key"
            value={apiKey}
            onChange={(e, v) => setApiKey(v || "")}
          />
          <TextField
            label="Prompt"
            value={prompt}
            onChange={(e, v) => setPrompt(v || "")}
          />
          <TextField
            label="Image variation URL"
            value={variationURL}
            onChange={(e, v) => setVariationURL(v || "")}
          />
          <PrimaryButton
            text={`Add OpenNI`}
            onClick={() => {
              addEngine();
            }}
            disabled={engines.includes(SupportedEngines.OPENNI) || !apiKey}
            allowDisabledFocus
          />
          <PrimaryButton
            text={`Generate using OpenNI ${engines.length}`}
            onClick={() => {
              generate();
            }}
            allowDisabledFocus
          />
          <img src={image} alt={prompt} />
          <img src={variation} alt={""} />
        </Stack> */}
      </div>
    </ImageGeneratorContext.Provider>
  );
}

export default App;
