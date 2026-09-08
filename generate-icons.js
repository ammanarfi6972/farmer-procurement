const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQMAAAA/zN/+AAAAA1BMVEUAFoAr/B2CAAAAAXRSTlMAQObYZgAAABtJREFUeF7twTEBAAAAwqD1T20MH6AAAAAAcGoWMAABoYcTlwAAAABJRU5ErkJggg==';

fs.writeFileSync(path.join(dir, 'icon-192x192.png'), Buffer.from(b64, 'base64'));
fs.writeFileSync(path.join(dir, 'icon-512x512.png'), Buffer.from(b64, 'base64'));

console.log('Icons generated successfully.');
