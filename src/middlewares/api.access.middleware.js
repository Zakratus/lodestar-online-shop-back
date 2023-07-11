module.exports = function (req, res, next) {
    return !req.path.includes('/api/v1') ?  res.status(401).send('Restricted.') : next();
}
