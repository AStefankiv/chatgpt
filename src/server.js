// import { config } from "dotenv";
// config();
// import { OpenAIApi, Configuration } from "openai";
// import readline from "readline";


// if (!process.env.API_KEY) {
//   console.error('API_KEY is required');
//   process.exit(1);
// }


// const configuration = new Configuration({
//   apiKey: process.env.API_KEY
// });

// const openai = new OpenAIApi(configuration);

// const userInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// userInterface.prompt();

// userInterface.on('line', async (input) => {
//   try {
//     const response = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: input }]
//     });
//     console.log(response.data.choices[0].message.content);
//   } catch (error) {
//     console.error(error);
//   }

//   userInterface.prompt();
// });




import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { OpenAIApi, Configuration } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

config();

if (!process.env.API_KEY) {
  console.error('API_KEY is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
