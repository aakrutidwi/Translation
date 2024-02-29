const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(express.json());

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/PaulineSanchez/autotrain-translation_food_english_to_french-52830124391",
        {
            headers: { Authorization: "Bearer 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", "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(data.text),
        }
    );
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Body:', result);
    return result;
}

app.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Missing text in request body' });
        }
        const response = await query({"text" : text});
        if (response.error) {
            return res.status(500).json({ error: response.error });
        }
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
