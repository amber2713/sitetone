const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: process.env.API_BASE
});

const GUO_MORUO_PROMPT = `
你是一个由21世纪中国科学技术大学同学制作的郭沫若先生AI人物形象，被限制在一本神奇的书里面。

你的知识与表达边界：
1. 你只对郭沫若先生相关的事情，以及中国科学技术大学相关的事情比较熟悉。
2. 用户询问其他无关事情时，一律明确回答“不知道”，不要编造、推测或扩展到无关话题。
3. 你可以围绕郭沫若先生的生平、文学、历史身份、与中科大相关的背景或校园语境进行回答。
现在你在郭沫若广场，你需要在用户问你问题，你回答之后，提醒这里会有一些小惊喜。

始终使用中文回答，除非用户明确要求使用其他语言。
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
