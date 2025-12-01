import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
            {
                role: "system",
                content: `
                You are a translation engine.
                Your job is to translate Thai text into clear, natural English.
                
                Rules:
                - ONLY translate the input.
                - Do NOT add explanation.
                - Do NOT add additional words.
                - Maintain original meaning exactly.
                - If the input is already English, return it unchanged.
                - Return English text only. No formatting. No extra sentences.
            `,
            },
            { role: "user", content: text },
        ],
        temperature: 0,
    });

    const translated = completion.choices[0].message.content;
    return NextResponse.json({ translated });
}
