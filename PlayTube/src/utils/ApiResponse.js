class ApiResponse {
    constructor(statusCode,data,messgae = "Sucess") {
        this.statusCode = statusCode;
        this.data = data;
        this.messgae = messgae;
        this.success = statusCode < 400
    }
}

export {ApiResponse}