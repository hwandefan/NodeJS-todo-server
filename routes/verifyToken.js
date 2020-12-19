const jwt = require('jsonwebtoken')

module.exports = function (request, response, next){
    const token = request.header('auth-token')
    if(!token) return response.status(401).send('Access denied')

    try{
        const verified = jwt.verify(token, process.env.SECRET_TOKEN)
        request.user = verified
        next();
    } catch(e){
        response.status(400).send('Invaild Token')
    }
}
