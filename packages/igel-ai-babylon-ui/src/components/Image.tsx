import {
    Menu,
    MenuTrigger,
    Tooltip,
    MenuButton,
    MenuPopover,
    MenuList,
    MenuItem,
    Spinner,
    Label,
} from "@fluentui/react-components";
import { ListRegular } from "@fluentui/react-icons";
import { useContext } from "react";
import { ImageGeneratorContext } from "../ImageGeneratorContext";
import classes from "./Image.module.css";

export interface IImageProps {
    label?: string;
    image: string;
    loading?: boolean;
    alt?: string;
    onImageRemoved?: () => void;
    extraMenuItems?: { label: string; onClick: () => void }[];
    keepInResults?: boolean;
    forceMenu?: boolean;
}
export function SingleImage({
    image,
    onImageRemoved,
    loading,
    alt,
    label,
    extraMenuItems,
    keepInResults,
    forceMenu,
}: IImageProps) {
    const { generatedImages, setSelectedImage, updateGeneratedImages } =
        useContext(ImageGeneratorContext);
    return (
        <div className={classes.imageContainer}>
            {label && <Label size="large">{label}</Label>}
            {loading && <Spinner size="huge" label="Loading..." />}
            {image && !loading && (
                <img src={image} alt={alt ?? "Generated Image"} />
            )}
            {(forceMenu || image) && (
                <div className={classes.menu}>
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <Tooltip content="Image menu" relationship="label">
                                <MenuButton
                                    size="large"
                                    appearance="primary"
                                    icon={<ListRegular />}
                                />
                            </Tooltip>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                <MenuItem
                                    onClick={() => {
                                        setSelectedImage(image);
                                    }}
                                >
                                    Set as image URL
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        const link =
                                            document.createElement("a");
                                        link.download = "generated.png";
                                        link.href = image;
                                        link.click();
                                    }}
                                >
                                    Download
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        if (!keepInResults) {
                                            updateGeneratedImages(
                                                generatedImages.filter(
                                                    (img) => img !== image
                                                )
                                            );
                                        }
                                        onImageRemoved?.();
                                    }}
                                >
                                    Delete
                                </MenuItem>
                                {extraMenuItems?.map((item) => (
                                    <MenuItem onClick={item.onClick}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </div>
            )}
        </div>
    );
}
