import { Button, Input, Label } from "@fluentui/react-components";
import { IImageGeneratorResponse } from "igel-ai";
import { useState } from "react";
import { generateCrossMask, prepareImageForSeamlessTexture } from "../../Helper";
import {
  imageGenerator,
  ImageGeneratorContext,
} from "../../ImageGeneratorContext";
import classes from "./Main.module.css";

export function Main() {
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [maskUrl, setMaskUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  const text2image = () => {
    imageGenerator
      .textToImage(prompt, {
        negativePrompt: negativePrompt,
        responseType: "base64",
      })
      .then(setResultUrlFromReturnValue);
  };

  const imageVariation = () => {
    imageGenerator
      .imageToImage("", {
        negativePrompt: negativePrompt,
        image: imageUrl,
      })
      .then(setResultUrlFromReturnValue);
  };

  const inpainting = () => {
    imageGenerator
      .inpainting(prompt, {
        negativePrompt: negativePrompt,
        image: imageUrl,
        mask: maskUrl || imageUrl,
      })
      .then(setResultUrlFromReturnValue);
  };

  const setResultUrlFromReturnValue = (res: IImageGeneratorResponse) => {
    const firstImage = res.images[0];
    if (firstImage.startsWith("http")) {
      setResultUrl(res.images[0]);
    } else {
      if (firstImage.startsWith("data:image")) {
        setResultUrl(firstImage);
      } else {
        setResultUrl(`data:image/png;base64,${res.images[0]}`);
      }
    }
  };

  return (
    <ImageGeneratorContext.Consumer>
      {(value) => (
        <div className={classes.mainContainer}>
          <h1>Image generator</h1>
          <Label htmlFor="prompt" disabled={!value.enabledEngines.length}>
            Prompt
          </Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            disabled={!value.enabledEngines.length}
          />
          <Label htmlFor="negativePrompt" disabled={!value.enabledEngines.length}>
            Negative Prompt
          </Label>
          <Input
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => {
              setNegativePrompt(e.target.value);
            }}
            disabled={!value.enabledEngines.length}
          />
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
            }}
            disabled={!value.enabledEngines.length}
          />
          <Label htmlFor="maskUrl">Mask URL (Optional)</Label>
          <Input
            id="maskUrl"
            value={maskUrl}
            onChange={(e) => {
              setMaskUrl(e.target.value);
            }}
            disabled={!value.enabledEngines.length}
          />
          <div className={classes.buttonsContainer}>
            <Button disabled={!prompt} onClick={text2image}>
              Text2Image
            </Button>
            <Button disabled={!prompt || !imageUrl} onClick={imageVariation}>
              Image Variation
            </Button>
            <Button disabled={!prompt || !imageUrl} onClick={inpainting}>
              Inpainting
            </Button>
          </div>
          <img src={resultUrl} alt={prompt}></img>
          <div className={classes.buttonsContainer}>
            <Button
              onClick={() => {
                setImageUrl(resultUrl);
              }}
            >
              Use as variationURL
            </Button>
            <Button
              onClick={async () => {
                const newUrl = await prepareImageForSeamlessTexture(resultUrl);
                setResultUrl(newUrl);
              }}
            >
              Prepare for seamless
            </Button>
            <Button
              onClick={async () => {
                const newUrl = await generateCrossMask(resultUrl);
                setMaskUrl(newUrl);
              }}
            >
              Generate cross mask
            </Button>
          </div>
        </div>
      )}
    </ImageGeneratorContext.Consumer>
  );
}
