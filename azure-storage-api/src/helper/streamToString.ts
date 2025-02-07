export async function streamToString(readableStream: any) {
    return new Promise((resolve, reject) => {
        const chunks: any = [];
        readableStream.on("data", (data: any) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}