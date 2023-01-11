import { useContext } from "react";
import { ImageGeneratorContext } from "../ImageGeneratorContext";
import { SingleImage } from "./Image";
import classes from "./ImageList.module.css";

export function ImageList() {
    const { generatedImages } = useContext(ImageGeneratorContext);
    return (
        <div className={classes.imageList}>
            {generatedImages.map((image, index) => (
                <SingleImage image={image} key={index}></SingleImage>
            ))}
        </div>
    );
}
