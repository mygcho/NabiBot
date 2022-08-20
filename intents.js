generatedGreetings = ["Hey.", "Hi.", "Hello.", "Greetings.", "Hi, friend.", "Hello, human."];
generatedFarewells = ["Bye!", "See you.", "Nice working with you.", "Later!", "Goodbye, human!", "Bye bye."];
generatedFiller = ["Okay.", "Alrighty.", "Yup.", "Uh-huh.", "Hmmm.", "Alright.", "Mhmm.", "Yeah."];

function addIntents(classifier) {
    // Greeting intent.
    classifier.addDocument('hello', 'greeting');
    classifier.addDocument('hi', 'greeting');
    classifier.addDocument('howdy', 'greeting');
    classifier.addDocument('hey', 'greeting');
    classifier.addDocument('hola', 'greeting');
    classifier.addDocument('yo', 'greeting');
    // Farewell intent.
    classifier.addDocument('bye', 'bye');
    classifier.addDocument('goodbye', 'bye');
    classifier.addDocument('good bye', 'bye');
    classifier.addDocument('later', 'bye');
    classifier.addDocument('farewell', 'bye');
    classifier.addDocument('see ya', 'bye');
    // Filler intent.
    classifier.addDocument('ok', 'filler');
    classifier.addDocument('okay', 'filler');
    classifier.addDocument('alright', 'filler');
    classifier.addDocument('ya', 'filler');
    classifier.addDocument('yeah', 'filler');
    classifier.addDocument('haha', 'filler');

    classifier.train();

     // Use the code below if you want to modify the intents! Make sure to delete classifier.json first.
    //classifier.save('classifier.json', function(err, classifier) {
        //if (err) {
           // throw new Exception(err);
          //}
          //console.log(classifier);
    //   // the classifier is saved to the classifier.json file!
    //});
}

module.exports = {
    add: addIntents,
    generatedGreetings: generatedGreetings,
    generatedFarewells: generatedFarewells,
    generatedFiller: generatedFiller
  };