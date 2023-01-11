import { Button, Input, Label, Spinner } from "@fluentui/react-components";
import { Select } from "@fluentui/react-components/unstable";
import { IImageGeneratorResponse, SupportedEngines } from "igel-ai";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    cropToSquare,
    generateCrossMask,
    prepareImageForSeamlessTexture,
    processMaskImage,
} from "../../Helper";
import {
    imageGenerator,
    ImageGeneratorContext,
} from "../../ImageGeneratorContext";
import { SingleImage } from "../Image";
import classes from "./Main.module.css";

export function Main() {
    const [prompt, setPrompt] = useState<string>("");
    const [negativePrompt, setNegativePrompt] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [maskUrl, setMaskUrl] = useState<string>("");
    const [resultUrl, setResultUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [seamlessProcess, setSeamlessProcess] = useState<boolean>(false);
    const [engine, setEngine] = useState<SupportedEngines>();
    const [maskSize, setMaskSize] = useState<number>(0.12);

    const {
        generatedImages,
        updateGeneratedImages,
        selectedImage,
        setSelectedImage,
    } = useContext(ImageGeneratorContext);

    const onError = (error: Error) => {
        console.error(error);
        setLoading(false);
    };

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
        open: openImageUrl,
    } = useDropzone({ onDrop: onDropImageUrl, noClick: true });
    const onDropMaskUrl = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        // check if it is an image
        if (acceptedFiles[0].type.indexOf("image") !== 0) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const dataUrl = reader.result;
            if (typeof dataUrl === "string") {
                // process the mask, convert to red-white
                setMaskUrl(await processMaskImage(dataUrl));
            }
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);
    const {
        getRootProps: getRootPropsMaskUrl,
        getInputProps: getInputPropsMaskUrl,
        isDragActive: isDragActiveMaskUrl,
        open: openMaskUrl,
    } = useDropzone({ onDrop: onDropMaskUrl, noClick: true });

    const text2image = () => {
        setLoading(true);
        imageGenerator
            .textToImage(
                prompt,
                {
                    negativePrompt: negativePrompt,
                    responseType: "base64",
                },
                engine
            )
            .then(setResultUrlFromReturnValue)
            .then(() => setLoading(false))
            .catch(onError);
    };

    const imageVariation = () => {
        setLoading(true);
        imageGenerator
            .imageToImage(
                "",
                {
                    negativePrompt: negativePrompt,
                    image: imageUrl,
                    responseType: "base64",
                },
                engine
            )
            .then(setResultUrlFromReturnValue)
            .then(() => setLoading(false))
            .catch(onError);
    };

    const inpainting = () => {
        setLoading(true);
        imageGenerator
            .inpainting(
                prompt,
                {
                    negativePrompt: negativePrompt,
                    image: imageUrl,
                    mask: maskUrl || imageUrl,
                    responseType: "base64",
                },
                engine
            )
            .then(setResultUrlFromReturnValue)
            .then(() => setLoading(false))
            .catch(onError);
    };

    const processForSeamless = () => {
        setSeamlessProcess(true);
        cropToSquare(imageUrl)
            .then((cropped) => {
                return [
                    generateCrossMask(cropped, maskSize).then((cross) => {
                        setMaskUrl(cross);
                    }),
                    prepareImageForSeamlessTexture(cropped).then((newUrl) => {
                        setImageUrl(newUrl);
                    }),
                ];
            })
            .then(() => {
                setSeamlessProcess(false);
            }, onError);
    };

    const setResultUrlFromReturnValue = (res: IImageGeneratorResponse) => {
        let firstImage = res.images[0];
        if (firstImage.startsWith("http")) {
            // setResultUrl(res.images[0]);
        } else {
            if (firstImage.startsWith("data:image")) {
                // setResultUrl(firstImage);
            } else {
                firstImage = `data:image/png;base64,${res.images[0]}`;
            }
        }
        setResultUrl(firstImage);
        updateGeneratedImages([...generatedImages, firstImage]);
    };

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(selectedImage);
        }
    }, [selectedImage]);

    useEffect(() => {
        if (imageUrl) {
            setSelectedImage("");
        }
    }, [imageUrl]);

    return (
        <ImageGeneratorContext.Consumer>
            {(value) => (
                <div className={classes.mainContainer}>
                    <h1>Image generator</h1>
                    <Label required htmlFor={"engine-underline"}>
                        Image generator
                    </Label>
                    <Select
                        id={`engine-underline`}
                        appearance="outline"
                        value={engine}
                        onChange={(e) =>
                            setEngine(e.target.value as SupportedEngines)
                        }
                    >
                        {value.enabledEngines.map((key, index) => (
                            <option
                                key={key}
                                value={Object.values(SupportedEngines)[index]}
                            >
                                {Object.values(SupportedEngines)[index]}
                            </option>
                        ))}
                    </Select>
                    <Label
                        htmlFor="prompt"
                        disabled={!value.enabledEngines.length}
                    >
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
                    <Label
                        htmlFor="negativePrompt"
                        disabled={engine !== SupportedEngines.STABLEDIFFUSION}
                    >
                        Negative Prompt
                    </Label>
                    <Input
                        id="negativePrompt"
                        value={negativePrompt}
                        onChange={(e) => {
                            setNegativePrompt(e.target.value);
                        }}
                        disabled={engine !== SupportedEngines.STABLEDIFFUSION}
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
                        <Button
                            disabled={!prompt || !imageUrl}
                            onClick={imageVariation}
                        >
                            Image Variation
                        </Button>
                        <Button
                            disabled={!prompt || !imageUrl}
                            onClick={inpainting}
                        >
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
                            <Label size="large">Image input</Label>
                            <input {...getInputPropsImageUrl()} />
                            <SingleImage
                                image={imageUrl}
                                alt={prompt}
                                onImageRemoved={() => {
                                    setImageUrl("");
                                }}
                                loading={seamlessProcess}
                                forceMenu={true}
                                extraMenuItems={[
                                    {
                                        label: "Load from disk",
                                        onClick: openImageUrl,
                                    },
                                    {
                                        label: "Prepare for seamless",
                                        onClick: processForSeamless,
                                    },
                                    {
                                        label: "Crop to square",
                                        onClick: () => {
                                            cropToSquare(imageUrl)
                                                .then((cropped) => {
                                                    setImageUrl(cropped);
                                                })
                                                .catch(onError);
                                        },
                                    },
                                    {
                                        label: "Generate mask from image",
                                        onClick: () => {
                                            if (!imageUrl) return;
                                            processMaskImage(imageUrl)
                                                .then(setMaskUrl)
                                                .catch(onError);
                                        },
                                    },
                                ]}
                            ></SingleImage>
                        </div>
                        <div
                            className={`${classes.imageContainer} ${
                                isDragActiveImageUrl || isDragActiveMaskUrl
                                    ? classes.dropZone
                                    : ""
                            }`}
                            {...getRootPropsMaskUrl()}
                        >
                            <Label size="large">Mask input</Label>
                            <input {...getInputPropsMaskUrl()} />
                            <SingleImage
                                image={maskUrl}
                                alt={prompt}
                                onImageRemoved={() => {
                                    setMaskUrl("");
                                }}
                                loading={seamlessProcess}
                                forceMenu={true}
                                extraMenuItems={[
                                    {
                                        label: "Load from disk",
                                        onClick: openMaskUrl,
                                    },
                                    // {
                                    //     label: "Increase mask size",
                                    //     onClick: () => {
                                    //         setMaskSize(maskSize + 0.02);
                                    //     },
                                    // },
                                    // {
                                    //     label: "Decrease mask size",
                                    //     onClick: () => {
                                    //         setMaskSize(maskSize - 0.02);
                                    //     },
                                    // },
                                ]}
                            ></SingleImage>
                        </div>
                    </div>
                    <div
                        className={`${classes.imageContainer} ${classes.resultContainer}`}
                    >
                        <Label size="large">Result</Label>
                        <SingleImage
                            image={resultUrl}
                            loading={loading}
                            keepInResults={true}
                            onImageRemoved={() => {
                                setResultUrl("");
                            }}
                        ></SingleImage>
                    </div>
                </div>
            )}
        </ImageGeneratorContext.Consumer>
    );
}
