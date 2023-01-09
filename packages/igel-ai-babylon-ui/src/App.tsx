import { useState } from "react";
import "./App.css";
import { PrimaryButton, Stack, TextField } from "@fluentui/react";
import { ImageGeneratorContext, imageGenerator } from "./ImageGeneratorContext";
import { SupportedEngines } from "igel-ai";
// just a test
import { OpenAIImageGeneratorPlugin } from "igel-ai";

function App() {
  const [engines, setEngines] = useState<SupportedEngines[]>([]);
  // DEBUGGING! Should not be here
  const [apiKey, setApiKey] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [variation, setVariation] = useState<string>("");
  const [variationURL, setVariationURL] = useState<string>("");
  const addEngine = () => {
    const newEngine = new OpenAIImageGeneratorPlugin(
      apiKey
    );
    imageGenerator.addPlugin("openai", newEngine);
    setEngines([...engines, "openai"]);
    if (variationURL) {
      if (prompt) {
        imageGenerator
          .inpainting(prompt, {
            image: variationURL,
            mask: variationURL,
          })
          .then((res) => {
            console.log(res);
            setVariation(res.images[0]);
          });
      } else {
        imageGenerator
          .imageToImage("", {
            image: variationURL,
          })
          .then((res) => {
            console.log(res);
            setVariation(res.images[0]);
          });
      }
    } else {
      imageGenerator
        .textToImage(prompt, {
          responseType: "base64",
        })
        .then((res) => {
          console.log(res);
          setImage(`data:image/png;base64,${res.images[0]}`);
        });
    }
  };
  return (
    <ImageGeneratorContext.Provider
      value={{
        registeredEngines: engines,
        imageGenerator,
      }}
    >
      <div className="App">
        <Stack>
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
            text={`Generate using OpenNI ${engines.length}`}
            onClick={() => {
              addEngine();
            }}
            allowDisabledFocus
          />
          <img src={image} alt={prompt} />
          <img src={variation} alt={""} />
        </Stack>
      </div>
    </ImageGeneratorContext.Provider>
  );
}

export default App;
