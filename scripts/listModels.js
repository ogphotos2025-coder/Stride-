const fs = require("fs");

function getApiKey() {
    const content = fs.readFileSync(".env.local", "utf8");
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

async function listAllModels() {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.log("Error fetching models:", data);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

listAllModels();
