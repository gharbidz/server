// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ضع التوكن هنا بعد أن تحصل عليه
let mi9Token = 'YOUR_CURRENT_TOKEN_HERE';

app.post('/api/generate', async (req, res) => {
  const pkg = req.body.package;
  if (!pkg) return res.status(400).send('Package name is required.');

  const payload = {
    hl: 'en',
    package: pkg,
    device: 'phone',
    arch: 'arm64-v8a',
    vc: '0',
    device_id: '',
    sdk: 30,
    timestamp: Math.floor(Date.now() / 1000)
  };

  const dataParam = encodeURIComponent(Buffer.from(JSON.stringify(payload)).toString('base64'));
  const url = `https://api.mi9.com/get?token=${mi9Token}&data=${dataParam}`;

  try {
    const apiResp = await fetch(url);
    const text = await apiResp.text();
    const lines = text.trim().split('\n').filter(Boolean);
    const last = lines[lines.length - 1].replace(/^data:\s*/, '');
    const json = JSON.parse(last);

    res.json({ html: json.html || '', status: json.status || '' });
  } catch (err) {
    console.error('API error', err);
    res.status(500).json({ error: 'Server error during API fetch.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
