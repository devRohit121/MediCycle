module.exports = (schema) => {
    return (req, res, next) => {
        const data = req.body.batch || req.body;
        const { error, value } = schema.validate(data);
        req.body = value;

        if (error) {
            return res.status(400).json({
                message: error.details.map(el => el.message)
            });
        }

        req.body = value;
        next();
    };
};