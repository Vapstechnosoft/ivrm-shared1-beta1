const pdf = require('pdf-parse');

async function test() {
    try {
        console.log('typeof pdf:', typeof pdf);
        if (typeof pdf === 'function') {
            console.log('pdf-parse is loaded correctly as a function.');
        } else {
            console.error('pdf-parse export is NOT a function. typeof:', typeof pdf);
            console.log(JSON.stringify(pdf, null, 2));
        }
    } catch (e) {
        console.error('Test failed:', e);
    }
}

test();
