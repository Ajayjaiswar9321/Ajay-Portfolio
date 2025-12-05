module.exports = (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
};
