import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { decrypt } from "../utils/encryption"; // Assume this exists and works
import APIKey from "../models/APIKey"; // Assume this exists

// Load env
dotenv.config({ path: path.join(__dirname, "../../.env") });

const listModels = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL not found in env");
        }

        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to DB.");

        // Find the most recent key for any user (assuming single user dev env or just grabbing one to test)
        const keyDoc = await APIKey.findOne().sort({ createdAt: -1 }).select('+key');

        if (!keyDoc) {
            console.error("No API keys found in database.");
            process.exit(1);
        }

        const plainKey = decrypt(keyDoc.key);
        console.log(`Using API Key (descrypted): ${plainKey.substring(0, 5)}...`);

        // Check models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${plainKey.trim()}`);
        if (!response.ok) {
            console.error(`Error fetching models: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
        } else {
            const data = await response.json();
            console.log("\n--- Available Models ---");
            if (data.models) {
                // simple list
                const names = data.models
                    .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
                    .map((m: any) => m.name);
                console.log(names.join("\n"));
            } else {
                console.log("No models returned.");
                console.log(data);
            }
            console.log("------------------------\n");
        }

    } catch (error) {
        console.error("Script failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

listModels();
