export function unwrap(entity: any, includeKey?: boolean): any {
    const { partitionKey, rowKey, etag, timestamp, createdTime, ...rest } = entity;

    let unwrapped = includeKey ? { partitionKey, rowKey, ...rest } : rest;

    if (typeof createdTime === "bigint") {
        unwrapped = { ...unwrapped, createdTime: Number(createdTime) };
    }

    return unwrapped;
}