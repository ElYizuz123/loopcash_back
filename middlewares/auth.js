export function verifyKey (req, res, next) {
    const token = req.header("x-auth-token")
    if(!token) return res.status(401).send({
        success: false,
        error: "Access denied. Not token provided"
    })

    if(token != process.env.TOKEN) return res.status(401).send({
        success: false,
        error: "Token invalid"
    })

    next()
}