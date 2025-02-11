export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    const k = 1024;
    const sizes = ["KB", "MB", "GB", "TB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i - 1];
};