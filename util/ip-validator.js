// Convertir la lista de IPs en un array
const allowedIPs = process.env.ALLOWED_IPS.split(',').map(ip => ip.trim());

// Middleware para verificar la IP
module.exports = (request, response, next) => {
    const forwarded = request.headers['x-forwarded-for'];
    const clientIP = forwarded ? forwarded.split(',')[0].trim() : request.connection.remoteAddress;

    if (allowedIPs.includes(clientIP)) {
        return next();
    }
    return response.status(403).json({
            success: false,
            error: 'No autorizado'
        });
}