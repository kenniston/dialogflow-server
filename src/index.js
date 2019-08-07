const compression = require('compression')
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

const routes = require("./routes/dialogflow.route");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())

app.listen(3000, () => {
  console.log(`Server listening on port 3000.`);
});

app.use("/api", routes);