const http = require('http');

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/users/2',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const user = JSON.parse(data);
            console.log('=== BACKEND USER DATA ===');
            console.log('ID:', user.id);
            console.log('Nombre:', user.nombre);
            console.log('Email:', user.email);
            console.log('\n=== DIRECCIONES ===');
            console.log('direcciones field exists:', 'direcciones' in user);
            console.log('direcciones value:', user.direcciones);
            console.log('direcciones type:', typeof user.direcciones);
            console.log('direcciones is array:', Array.isArray(user.direcciones));
            console.log('\n=== METODOS PAGO ===');
            console.log('metodosPago field exists:', 'metodosPago' in user);
            console.log('metodosPago value:', user.metodosPago);
            console.log('metodosPago type:', typeof user.metodosPago);
            console.log('metodosPago is array:', Array.isArray(user.metodosPago));
            console.log('\n=== FULL JSON ===');
            console.log(JSON.stringify(user, null, 2));
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request error:', e);
});

req.end();
