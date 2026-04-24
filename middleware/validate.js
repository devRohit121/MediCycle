module.exports = (schema) => {
    return (req, res, next) => {
        const data = req.body.batch || req.body;

        const { error, value } = schema.validate(data);

        if (error) {
            const msg = error.details
                .map(el => el.message.replace(/"/g, ""))
                .join(", ");

            req.flash("error", msg);

            return res.redirect(req.originalUrl.includes("edit") 
                ? req.originalUrl 
                : "/batches/new");
        }

        req.body = value;
        next();
    };
};