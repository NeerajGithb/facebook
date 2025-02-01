const response = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        status: statusCode < 400 ? "success" : "error",
        message,
        data: data || {}, // Ensure `data` is always an object
    });
};

module.exports = response;
