const fs = require('fs');
const jwt = require('jsonwebtoken');

// Lê as chaves públicas e privadas
const PRIVATE_KEY = fs.readFileSync('./private.txt', 'utf8');
const PUBLIC_KEY = fs.readFileSync('./public.txt', 'utf8');

// Função para criar o token
function criarJwt(user, password) {
    const payload = { user, password };
    const token = jwt.sign(payload, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '0.5h' // 30 minutos
    });
    return token;
}

// Função para verificar o token
function verificar(token) {
    try {
        // Remove o prefixo "Bearer "
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        console.log("token dentro do verificar jwt"+ token);

        const decoded = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256'] 
        });
        console.log('Token válido! Payload:', decoded);
        return 'ok';
    } catch (err) {
        console.error('Token inválido!', err);
        return 'erro';
    }
}


module.exports = {
    criarJwt,
    verificar
};