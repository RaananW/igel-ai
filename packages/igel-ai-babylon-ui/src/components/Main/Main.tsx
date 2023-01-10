import { Button, Input, Label } from "@fluentui/react-components";
import { IImageGeneratorResponse } from "igel-ai";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  cropToSquare,
  generateCrossMask,
  prepareImageForSeamlessTexture,
} from "../../Helper";
import {
  imageGenerator,
  ImageGeneratorContext,
} from "../../ImageGeneratorContext";
import classes from "./Main.module.css";

export function Main() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [maskUrl, setMaskUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  const onDropImageUrl = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    // check if it is an image
    if (acceptedFiles[0].type.indexOf("image") !== 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);
  const {
    getRootProps: getRootPropsImageUrl,
    getInputProps: getInputPropsImageUrl,
    isDragActive: isDragActiveImageUrl,
  } = useDropzone({ onDrop: onDropImageUrl });
  const onDropMaskUrl = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    // check if it is an image
    if (acceptedFiles[0].type.indexOf("image") !== 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setMaskUrl(dataUrl);
      }
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);
  const {
    getRootProps: getRootPropsMaskUrl,
    getInputProps: getInputPropsMaskUrl,
    isDragActive: isDragActiveMaskUrl,
  } = useDropzone({ onDrop: onDropMaskUrl });

  const text2image = () => {
    imageGenerator
      .textToImage(prompt, {
        responseType: "base64",
      })
      .then(setResultUrlFromReturnValue);
  };

  const imageVariation = () => {
    imageGenerator
      .imageToImage("", {
        image: imageUrl,
        responseType: "base64",
      })
      .then(setResultUrlFromReturnValue);
  };

  const inpainting = () => {
    imageGenerator
      .inpainting(prompt, {
        image: imageUrl,
        mask: maskUrl || imageUrl,
        responseType: "base64",
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
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            // value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
            }}
            disabled={!value.enabledEngines.length}
          />
          <Label htmlFor="maskUrl">Mask URL (Optional)</Label>
          <Input
            id="maskUrl"
            // value={maskUrl}
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
          <div className={classes.buttonsContainer}>
            <div
              className={`${classes.imageContainer} ${
                isDragActiveImageUrl || isDragActiveMaskUrl
                  ? classes.dropZone
                  : ""
              }`}
              {...getRootPropsImageUrl()}
            >
              Image URL
              <input {...getInputPropsImageUrl()} />
              <img src={imageUrl} alt={prompt}></img>
            </div>
            <div
              className={`${classes.imageContainer} ${
                isDragActiveImageUrl || isDragActiveMaskUrl
                  ? classes.dropZone
                  : ""
              }`}
              {...getRootPropsMaskUrl()}
            >
              Mask URL
              <input {...getInputPropsMaskUrl()} />
              <img src={maskUrl} alt=""></img>
            </div>
          </div>
          <div
            className={`${classes.imageContainer} ${classes.resultContainer}`}
          >
            Result
            <img src={resultUrl} alt=""></img>
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              onClick={() => {
                setImageUrl(resultUrl);
              }}
            >
              Use as image URL
            </Button>
            <Button
              onClick={async () => {
                const cropped = await cropToSquare(imageUrl);
                const cross = await generateCrossMask(cropped);
                const newUrl = await prepareImageForSeamlessTexture(cropped);
                setMaskUrl(cross);
                setImageUrl(newUrl);
              }}
            >
              Prepare seamless texture
            </Button>
          </div>
        </div>
      )}
    </ImageGeneratorContext.Consumer>
  );
}
