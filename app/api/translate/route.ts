import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, isRichText } = await req.json();

    let systemPrompt = "";

    if (isRichText) {
        systemPrompt = `
            You are a professional translator. 
            The user will provide an HTML string in Thai.
            Your task is to translate the visible text content into English.
            
            CRITICAL RULES:
            1. **Do NOT** change, remove, or translate any HTML tags (e.g., <h2>, <p>, <b>, <ul>, <li>).
            2. Keep the HTML structure EXACTLY the same.
            3. Only translate the text between the tags.
            4. Do not wrap the output in markdown code blocks (like \`\`\`html). Return raw HTML string only.
            5. Maintain the original tone and meaning.
        `;
    } else {
        systemPrompt = `
            You are a translation engine.
            Your job is to translate Thai text into clear, natural English.
            
            Rules:
            - ONLY translate the input.
            - Do NOT add explanation.
            - Do NOT add additional words.
            - Maintain original meaning exactly.
            - If the input is already English, return it unchanged.
            - Return English text only. No formatting. No extra sentences.
        `;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                { role: "user", content: text },
            ],
            temperature: 0.3, 
        });

        const translated = completion.choices[0].message.content;
        return NextResponse.json({ translated });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { error: "Translation failed" },
            { status: 500 }
        );
    }
}
