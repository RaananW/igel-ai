export function saveFile(url: string, filename = "image.png") {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

export async function loadFile(
    url: string,
    _base64?: boolean
): Promise<string> {
    const response = await fetch(url);
    // if (base64) {
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    // }
    // return await response.arrayBuffer();
}

export async function imageToFileObject(
    image: string
): Promise<File> {
    const input =
        typeof image === "string" ? image : await arrayBufferToBase64(image);
    const response = await fetch(input);
    const blob = await response.blob();
    return new File([blob], "image.png", { type: "image/png" });
}

export async function arrayBufferToBase64(
    buffer: ArrayBuffer
): Promise<string> {
    const blob = new Blob([buffer]);
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function base64ToArrayBuffer(data: string) {
    const response = await fetch(data);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}
