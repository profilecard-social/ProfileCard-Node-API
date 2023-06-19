export function success(callback, { code = 200, success = true, message = "Success", body = {} }) {
    callback( { code: code, success: success, message: message, body: body } )
}

export function fail(callback, { code, success = false, message = "", body = {} }) {
    callback( { code: code, success: success, message: message, body: body } )
}