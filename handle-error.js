const handleError = (err, req, res, next) => {
    const response = {
        code: err.code || 500,
        msg: err.message || 'Internal server error',
    };
    res.json(response);
};

export default handleError;