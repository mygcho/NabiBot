const TelegramBot = require('node-telegram-bot-api'); // see all bot API methods here: https://core.telegram.org/bots/api#sendmessage
const natural = require('natural');
const classifierJSON = require('./classifier.json')
var intents = require('./intents');
var pomodoroStudy = require('./pomodoroStudy');

telegram = new TelegramBot("5418499438:AAE3O0f-RwGcVUGSv8Obp-gBPNUVYf00w-4", { polling: true });
var classifier = new natural.BayesClassifier();

// Add the intents to begin Natural Language Processing.
intents.add(classifier);

var intentFile = classifierJSON['docs'];
var length = intentFile.length;

// Check how much a typed word matches an actual word using node NLP
function checkSimilarity(label, word){
  var stemmedWord = natural.PorterStemmer.stem(word.toLowerCase());
  var intendedWord;

  for (var i = 0; i < length; i++) {
    if (intentFile[i]['label'] == label) {
      intendedWord = intentFile[i]['text'][0];
      break;
    }
  }

  if (natural.JaroWinklerDistance(stemmedWord, intendedWord) > 0.5) {
    console.log(natural.JaroWinklerDistance(stemmedWord,intendedWord));
    return true;
 
  }
  else {
    console.log(natural.JaroWinklerDistance(stemmedWord, intendedWord));
   return false;

  }
}

// Checks and compares similarity between user input and the string inputs on the classifier.json file.
telegram.on("message", (msg) => {
  console.log(classifier.getClassifications(msg.text))
  var str = msg.text;
  var letter = str.charAt(0);

  if (letter === '/') { 
  }
  else if (classifier.getClassifications(msg.text)[0]['value'] <= 0.7) {
    if  (classifier.getClassifications(msg.text)[0]['label'] == 'greeting' && checkSimilarity('greeting', msg.text)) {
      telegram.sendMessage(msg.chat.id, (intents.generatedGreetings[Math.floor(Math.random() * intents.generatedGreetings.length)]));
    }
    else if (classifier.getClassifications(msg.text)[0]['label'] == 'bye' || checkSimilarity('bye', msg.text)) {
      telegram.sendMessage(msg.chat.id, (intents.generatedFarewells[Math.floor(Math.random() * intents.generatedFarewells.length)]));
    }
    else if (classifier.getClassifications(msg.text)[0]['label'] == 'filler' || checkSimilarity('filler', msg.text)) {
      telegram.sendMessage(msg.chat.id, (intents.generatedFiller[Math.floor(Math.random() * intents.generatedFiller.length)]));
    }
  else {
    telegram.sendMessage(msg.chat.id, "Whoa sorry what did you say? Can you say it again?");
  }
}
});

// Runs when user uses "/pomodoro" command
telegram.onText(/\/pomodoro (.+)/, (msg, assignName) => {
  const sessionType = assignName[1];
  if ((sessionType === 'status') || (sessionType === 'Status')) {
    pomodoroStudy.status(msg, global.lastSession, telegram);
  }
  else if ((sessionType === 'clear') || (sessionType === 'Clear')) {
    global.pomoSession = false;
    global.breakSession = false;
    global.noSession = true;
    pomodoroStudy.clear(msg, telegram);
  }
  else {
    global.lastSession = sessionType;
    var date = new Date().toLocaleString();
    telegram.sendMessage(msg.chat.id, `Study session "${sessionType}" started on ${date}.`);
    global.pomoStatus = true;
    global.noSession = false;
    global.timer = setTimeout(pomodoroStudy.pomoSession, 25 * 60 * 1000, msg, telegram);
    global.timer;
    global.timerStart = Date.now();
  }
});
