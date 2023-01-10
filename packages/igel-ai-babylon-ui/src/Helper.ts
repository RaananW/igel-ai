export const generateCrossMask = async (imageUrl: string, crossSize = 0.2) => {
    const canvas = await imageUrlToCanvas(imageUrl);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let w = 0; w < canvas.width; w++) {
        for (let h = 0; h < canvas.height; h++) {
            const i = (w + h * canvas.width) * 4;
            if (
                (
                    w > (canvas.width / 2) + (canvas.width * (crossSize / 2)) ||
                    w < (canvas.width / 2) - (canvas.width * (crossSize / 2))
                ) &&
                (
                    h > (canvas.height / 2) + (canvas.height * (crossSize / 2)) ||
                    h < (canvas.height / 2) - (canvas.height * (crossSize / 2))
                )
            ) {
                data[i] = 255;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 255;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

export const prepareImageForSeamlessTexture = async (imageUrl: string) => {
    const canvas = await imageUrlToCanvas(imageUrl);
    const secondCanvas = document.createElement('canvas');
    secondCanvas.width = canvas.width;
    secondCanvas.height = canvas.height;
    const ctx = secondCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    // 4 draw calls
    ctx.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(canvas, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(canvas, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(canvas, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, 0, 0, canvas.width / 2, canvas.height / 2);
    return secondCanvas.toDataURL();
}

export const imageToCanvas = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    ctx.drawImage(image, 0, 0);
    return canvas;
}

export const imageUrlToCanvas = async (imageUrl: string) => {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            resolve(imageToCanvas(img));
        };
        img.onerror = (err) => {
            reject(err);
        };
    })
}