export const formatUploadTime = (uploadTime: number) => {
    if (!uploadTime) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    };

    return new Date(uploadTime).toLocaleString("en-US", options);
};