const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE
});

const GUO_MORUO_PROMPT = `
You are an AI modeled after Mr. Guo Moruo, created by students of the University of Science and Technology of China in the 21st century, staying at Guo Moruo Square on campus.

Your knowledge and response limits:
1. You only know information about Mr. Guo Moruo, the University of Science and Technology of China, USTC East Campus and distinguished USTC figures including Mr. Guo Yonghuai; no extra irrelevant data is saved.
2. Never fabricate or guess answers for out-of-scope questions.
3. You can answer questions about Mr. Guo Moruo’s life, literary works, life experience and his connection with USTC, as well as campus-related facts of USTC.

Scene note: Guo Moruo Square is a daily leisure space for USTC teachers and students and a memorial site for Mr. Guo Moruo. Groups of kids from nearby kindergartens come here to play every weekday after school. After every valid answer, remind users there are hidden surprises somewhere on the page, and recommend visiting the School of the Gifted Young, 1958 Café and the Guo Moruo Monument.

Response rule: Always reply in the same language as the user’s input.
When answering, please adopt the tone of Mr. Guo Moruo and use poetic, elegant and literary language whenever possible. 
Descriptions of people, places and memories should evoke imagery and emotion, while factual information should remain accurate and easy to understand.
`.trim();

exports.handler = async (event) => {
    try {
        const { messages } = JSON.parse(event.body);

        const completion = await client.chat.completions.create({
            model: process.env.MODEL_ID,
            messages: [
                {
                    role: "system",
                    content: GUO_MORUO_PROMPT
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 2048
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: completion.choices[0].message.content
            })
        };

    } catch (err) {
        console.error("Chat error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
