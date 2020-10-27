const express = require('express');
const app = express(),
      port = process.env.PORT || 3000;

const controller = require('./controller');

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(process.cwd() + "/client/dist/"));

  app.get('/', (req,res) => {
    res.sendFile(process.cwd() + "/client/dist/index.html")
  });
}

app.post('/api/calculate',
  controller.calculate,
  (req, res) => {
  return res.status(200).json( res.locals.result );
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.sendStatus(404).send("Not found");
});

// express global error handler
app.use((err, req, res, next) => {
  let defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  let errorObj = Object.assign(defaultErr, err);
  res.status(errorObj.status).json({ message: errorObj.message });
});

app.listen(port, () => {
    console.log(`Server listening on the port:: ${port}`);
});
