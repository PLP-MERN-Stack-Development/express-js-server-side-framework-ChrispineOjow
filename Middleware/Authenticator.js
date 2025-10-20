const apiKeyAuth = (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey || apiKey !== process.env.API_KEY){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}

export default apiKeyAuth;