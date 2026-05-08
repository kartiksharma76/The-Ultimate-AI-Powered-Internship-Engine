const pdf = require('pdf-parse');
const fs = require('fs');

async function test() {
    try {
        console.log("Testing pdf-parse...");
        // Just a dummy buffer check
        const dataBuffer = Buffer.from([0, 1, 2, 3]); 
        const data = await pdf(dataBuffer).catch(e => ({ text: "FAIL" }));
        console.log("Result:", data.text);
    } catch (e) {
        console.error("PDF Parse Error:", e);
    }
}
test();
