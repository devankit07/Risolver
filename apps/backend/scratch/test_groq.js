import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error("GROQ_API_KEY is not set in .env");
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function testGroq() {
    try {
        console.log("Testing Groq API with key:", apiKey.substring(0, 10) + "...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say hello world" }],
            model: "llama-3.1-8b-instant",
        });
        console.log("Response:", chatCompletion.choices[0].message.content);
        console.log("✅ Groq API is working!");
    } catch (error) {
        console.error("❌ Groq API failed:");
        console.error(error.message);
    }
}

testGroq();
