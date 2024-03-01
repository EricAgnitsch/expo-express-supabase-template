import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const port = 3000;
const HOST = '0.0.0.0';

app.use(bodyParser.json({limit: '10mb'}));

app.get('/', (req, res) => {
  res.send({
    data: 'Hello World!',
  });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://${HOST}:${port}`);
});