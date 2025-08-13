const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const { message } = req.body;
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        res.send({ text });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).send({ error: "Error processing your request." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});