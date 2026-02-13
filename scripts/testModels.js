const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Simple .env.local parser
function getApiKey() {
    const content = fs.readFileSync(".env.local", "utf8");
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

async function listModels() {
    try {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error("API Key not found in .env.local");
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log("Checking Gemini API Models...");

        // We can't list models with the client SDK easily without an authenticated list call
        // But we can test them
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                if (result.response) {
                    console.log(`✅ Model '${m}' is WORKING.`);
                }
            } catch (e) {
                console.log(`❌ Model '${m}' FAILED: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Discovery failed:", error);
    }
}

listModels();
