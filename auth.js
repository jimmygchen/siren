const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envFilePath = path.join(__dirname, '.env');

function generatePassword(length) {
  return crypto.randomBytes(length)
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '0')
    .replace(/\//g, '1');
}

fs.readFile(envFilePath, 'utf8', (err, data) => {
  if (err) {
    return console.error('Error reading .env file:', err);
  }

  const key = 'PASSWORD';
  const password = generatePassword(12);

  if (!data.includes(key)) {
    fs.appendFile(envFilePath, `${key}=${password}\n`, (err) => {
      if (err) {
        return console.error('Error writing to .env file:', err);
      }
      console.log(`${key} added to .env file successfully with generated password.`);
    });
  } else {
    console.log(`${key} already exists in the .env file.`);
  }
});
