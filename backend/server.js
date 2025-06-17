const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Simpan subscription yang dikirim dari frontend
app.post('/save-subscription', (req, res) => {
  const subscription = req.body;

  console.log('📬 Subscription diterima:', JSON.stringify(subscription, null, 2));

  // Di submission, cukup console.log, atau kamu bisa simpan ke file jika perlu
  res.status(201).json({ message: 'Subscription saved successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`);
});
