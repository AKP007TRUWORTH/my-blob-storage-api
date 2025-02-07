import * as storage from "../storage/storage";

export function azureErrorHandler(
    azureError: any,
    overrideMessage: boolean = false,
    overrideCondition?: string,
    overrideValue?: string
): any {
    let errorCodeRaw: number | string;
    let errorMessage: string;

    try {
        const parsedMessage = JSON.parse(azureError.message);
        errorCodeRaw = parsedMessage["odata.error"].code;
        errorMessage = parsedMessage["odata.error"].message.value;
    } catch (error) {
        errorCodeRaw = azureError.code;
        errorMessage = azureError.message;
    }

    if (overrideMessage && overrideCondition == errorCodeRaw) {
        errorMessage = overrideValue;
    }

    if (typeof errorCodeRaw === "number") {
        // This is a storage.Error that we previously threw; just re-throw it
        throw azureError;
    }

    let errorCode: storage.ErrorCode;
    switch (errorCodeRaw) {
        case "BlobNotFound":
        case "ResourceNotFound":
        case "TableNotFound":
            errorCode = storage.ErrorCode.NotFound;
            break;
        case "EntityAlreadyExists":
        case "TableAlreadyExists":
            errorCode = storage.ErrorCode.AlreadyExists;
            break;
        case "EntityTooLarge":
        case "PropertyValueTooLarge":
            errorCode = storage.ErrorCode.TooLarge;
            break;
        case "ETIMEDOUT":
        case "ESOCKETTIMEDOUT":
        case "ECONNRESET":
            // This is an error emitted from the 'request' module, which is a
            // dependency of 'azure-storage', and indicates failure after multiple
            // retries.
            errorCode = storage.ErrorCode.ConnectionFailed;
            break;
        default:
            errorCode = storage.ErrorCode.Other;
            break;
    }

    throw storage.storageError(errorCode, errorMessage);
}