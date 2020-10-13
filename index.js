let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
let cors = require('cors');

let fs = require('fs').promises;
let pdf = require('pdf-parse');

let multer = require('multer');
let upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/pdf/upload', upload.single('my-pdf'), async (req, res) => {
  let now = new Date();
  let newName = `uploads/${now.toISOString()}`;
  await fs.rename(req.file.path, newName);

  let dataBuffer = await fs.readFile(newName);
  let data = await pdf(dataBuffer);
  res.send({ datetime: now, data: data.text });
});

app.get('/pdf', async (req, res) => {
  let dir = './uploads/';
  let names = await fs.readdir(dir);
  let files = [];
  for (let name of names) {
    let dataBuffer = await fs.readFile(`${dir}${name}`);
    let data = await pdf(dataBuffer);
    files.push({ datetime: name, data: data.text });
  }
  res.send(files);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
