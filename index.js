require('dotenv').config();
const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
app.use(express.urlencoded({ extended: false }));

// Called when someone rings your Twilio number
app.post('/incoming-call', (req, res) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: 'speech',
    speechTimeout: 'auto',
    action: '/handle-speech',
    method: 'POST',
    language: 'en-AU',
  });

  gather.say(
    {
      voice: 'Google.en-AU-Wavenet-C',
      language: 'en-AU',
    },
    "G'day, thanks for calling Gold Coast Blinds and Shutters! " +
    "I'm your virtual assistant. I can answer questions, or book " +
    "a free measure and quote for you. How can I help you today?"
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

// Placeholder — wired to AI in Step 2
app.post('/handle-speech', (req, res) => {
  const customerSaid = req.body.SpeechResult;
  console.log('Customer said:', customerSaid);

  const twiml = new VoiceResponse();
  twiml.say(
    { voice: 'Google.en-AU-Wavenet-C', language: 'en-AU' },
    "Thanks for that! I'm still being set up — the Australian voice is working perfectly. Stay tuned!"
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
