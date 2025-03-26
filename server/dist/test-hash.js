import argon2 from 'argon2';
async function testHash() {
    const pass = await argon2.hash('perez');
    console.log('Password', pass);
}
testHash();
