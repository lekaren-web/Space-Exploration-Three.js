const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
module.exports = app;

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public'))
);


app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen('8080', () => {
console.log('Running on port 8080')
})