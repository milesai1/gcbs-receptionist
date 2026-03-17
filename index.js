require('dotenv').config();
const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const OpenAI = require('openai');
const systemPrompt = require('./prompt');

const app = express();
app.use(express.urlencoded({ extended: false }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Store conversation history per call (in memory)
const conversations = {};

// Incoming call — play greeting
app.post('/incoming-call', (req, res) => {
  const callSid = req.body.CallSid;
  conversations[callSid] = []; // start fresh conversation

  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: 'speech',
    speechTimeout: 'auto',
    action: '/handle-speech',
    method: 'POST',
    language: 'en-AU',
  });

  gather.say(
    { voice: 'Google.en-AU-Wavenet-C', language: 'en-AU' },
    "G'day, thanks for calling Gold Coast Blinds and Shutters! " +
    "I'm Jade, your virtual assistant. I can answer questions or " +
    "book a free measure and quote. How can I help you today?"
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle what the customer said
app.post('/handle-speech', async (req, res) => {
  const callSid = req.body.CallSid;
  const customerSaid = req.body.SpeechResult;

  console.log('Customer said:', customerSaid);

  // Add customer message to conversation history
  if (!conversations[callSid]) conversations[callSid] = [];
  conversations[callSid].push({ role: 'user', content: customerSaid });

  try {
    // Send to AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversations[callSid],
      ],
    });

    const aiReply = completion.choices[0].message.content.trim();
    console.log('AI replied:', aiReply);

    // Add AI reply to history
    conversations[callSid].push({ role: 'assistant', content: aiReply });

    const twiml = new VoiceRe
