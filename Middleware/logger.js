const logger = (req, res, next) => {
    const timestamp = new Date().toISOString(); // the toISOString Converts it to ISO 8601 format (standard international format)
    const method = req.method;
    const url = req.url;


    console.log(`[${timestamp}] ${method} ${url}`);
    next();
}

export default logger;