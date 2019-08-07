const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const dialogflow = require("dialogflow")
const { struct } = require("pb-util");

var dialogflowClient = {
  projectId: process.env.DIALOGFLOW_PROJECT_ID,
  sessionClient: new dialogflow.SessionsClient({
    keyFilename: `./dialogflow-dev.json`
  })
}

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/message/text/send', async (req, res) => {
  let { text, email, sessionId } = req.body
  let sessionPath = dialogflowClient.sessionClient.sessionPath(dialogflowClient.projectId, sessionId)

  console.log("\n############################");
  console.log("Text Message to Dialogflow");
  console.log("Question...: " + text);
  console.log("SessionId..: " + sessionId);
  console.log("Email......: " + email);
  console.log("############################");

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: `${text}`,
        languageCode: "pt-BR"
      }
    },
    queryParams: {
      contexts: [
        {
          name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/_context_data`,
          lifespanCount: 5,
          parameters: struct.encode({ u_email: email, sessionId: sessionId })
        }
      ]
    }
  };

  responses = await sessionClient.detectIntent(request);
  result = responses[0].queryResult;

  console.log("Response....: " + email);
  console.log("############################");
  res.send(result)
})

router.post('/message/audio/send', async (req, res) => {
  let { text, email, sessionId } = req.body
  let sessionPath = dialogflowClient.sessionClient.sessionPath(dialogflowClient.projectId, sessionId)

  console.log("\n############################");
  console.log("Audio Message to Dialogflow");
  console.log("SessionId..: " + sessionId);
  console.log("Email......: " + email);
  console.log("############################");

  // Read the content of the audio file and send it as part of the request.
  const readFile = util.promisify(fs.readFile);
  const inputAudio = await readFile(filename);
  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
    },
    inputAudio: inputAudio,
  };

  const [response] = await sessionClient.detectIntent(request);

  console.log('Detected intent:');
  logQueryResult(sessionClient, response.queryResult);
})

router.post('/message/fullfilment', async (req, res) => {

})

module.exports = router;