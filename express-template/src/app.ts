/// <reference path="../express-request.d.ts" />

import bodyParser from 'body-parser';
import express from 'express';
import {globalErrorHandler} from './middlewares/global-error-handler';
import notification from './routes/notification';

const app = express();
const port = 3000;
const HOST = '0.0.0.0';

app.use(bodyParser.json({limit: '10mb'}));

app.get('/', (req, res) => {
  res.send({
    data: 'Hello World!',
  });
});

// Add routes here
app.use(notification);

// ** The global error handling must be the last app.use() declaration **
app.use(globalErrorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://${HOST}:${port}`);
});