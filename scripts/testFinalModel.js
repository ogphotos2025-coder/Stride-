const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

function getApiKey() {
    const content = fs.readFileSync(".env.local", "utf8");
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

async function testFinalModel() {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const m = "gemini-2.0-flash";

    console.log(`Testing standard model: ${m}...`);
    try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hello Coach, tell me a 1-sentence tip.");
        console.log(`✅ SUCCESS: ${result.response.text()}`);
    } catch (e) {
        console.error(`❌ FAILED: ${e.message}`);
        if (e.message.includes("429")) {
            console.log("QUOTA HIT: This model is also rate-limited.");
        }
    }
}

testFinalModel();
