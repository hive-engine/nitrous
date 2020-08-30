// should be used as a docker healthcheck
const http = require("http");

const options = {
    host: "localhost",
    port: "8080",
    path: '/.well-known/healthcheck.json',
    timeout: 5000
};

const request = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    }
    else {
        console.error(`ERROR: ${res.statusCode}`);
        process.exit(1);
    }
});

request.on('error', (err) => {
    console.error('ERROR', err);
    process.exit(1);
});

request.end();
