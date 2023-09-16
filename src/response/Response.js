export function success(callback, { code = 200, success = true, message = "Success", body = {} }) {
    try {
        callback( { code: code, success: success, message: message, body: body } )
    } catch (error) {
        console.log(error);
    }
}

export function fail(callback, { code, success = false, message = "", body = {} }) {
    try {
        callback( { code: code, success: success, message: message, body: body } )
    } catch (error) {
        console.log(error);
    }
}