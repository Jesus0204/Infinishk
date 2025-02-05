// Convertir la lista de IPs en un array
const allowedIPs = process.env.ALLOWED_IPS.split(',').map(ip => ip.trim());

// Middleware para verificar la IP
module.exports = (request, response, next) => {
    const clientIP = request.ip || request.connection.remoteAddress;

    console.log('Client IP:', clientIP);
    console.log('Allowed IPs:', allowedIPs);

    if (allowedIPs.includes(clientIP)) {
        return next();
    }
    return response.status(403).json({
            success: false,
            error: 'No autorizado'
        });
}