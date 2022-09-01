const http = require('http')
const app = require('./app')
const server = http.createServer(app)

const port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV || 'N/A';

server.listen(port, () => {
    console.log('====================================');
    console.log(`Server running on port ${port} in ${node_env}`);
    console.log('====================================');
});