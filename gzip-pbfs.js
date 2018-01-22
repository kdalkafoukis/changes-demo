module.exports = (request, response, next) => {
    if (request.url.endsWith('.pbf')) {
        response.setHeader('Content-Encoding', 'gzip')
        next()
    }
    else next()
}
