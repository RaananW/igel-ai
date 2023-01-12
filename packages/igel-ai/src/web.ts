// make node work in the browser
declare global {
    interface FormData {
        getHeaders: () => { [key: string]: string };
    }
}
FormData.prototype.getHeaders = () => {
    return { "Content-Type": "multipart/form-data" };
};

export * from "./webHelpers";
