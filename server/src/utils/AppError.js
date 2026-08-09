class AppError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = statusCode >= 400 && statusCode < 500
        ? "fail"
        : "error";
  
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;