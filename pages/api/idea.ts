import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type IdeaResponse = {
    idea?: string;
    error?: string;
};

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<IdeaResponse>,
) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return response.status(405).json({ error: 'Method not allowed.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return response.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });
    }

    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
            model: 'gpt-5-nano',
            messages: [{
                role: 'user',
                content: 'Generate one original, practical business idea using AI agents. Include the target customer, problem, solution, pricing model, and a first validation step. Format the response in Markdown.',
            }],
        });
        const idea = completion.choices[0]?.message.content;

        if (!idea) {
            throw new Error('The model returned an empty response.');
        }

        return response.status(200).json({ idea });
    } catch (error) {
        console.error('Business idea generation failed:', error);
        return response.status(502).json({ error: 'The business idea service is unavailable. Please try again.' });
    }
}