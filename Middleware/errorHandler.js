const globalErroHandler = (err, req, res, next) => {

    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    // Send the response back to the client
    res.status(statusCode).json({
        status : 'error',
        message: err.message || 'Internal Server Error'
    })
}

export default globalErroHandler;