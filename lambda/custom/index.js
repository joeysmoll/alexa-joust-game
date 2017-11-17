'use strict';
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

const APP_ID = 'amzn1.ask.skill.07192ea1-da61-4773-943b-71d0286f6049';


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'joustTable';
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, attackStateHandlers);
    alexa.execute();
};

const STATES = {
    ATTACK: '_attack',
    PROTECT: '_protect'
};

var opponents = ['White knight of Vadjeron', 'Black knight of Comptone-ia', 'Green knight of Denveroth', 'Red knight of Texa-Shire', 'Rainbow knight of Gayderon', 'Blue knight of Metro-deffia', 'Stickman of Merrca'];

var randomOppenent = opponents[Math.floor(Math.random() * 6)];

var handlers = {
    'LaunchRequest': function () {
        this.emit('LaunchIntent');
        // this.response.speak('hello');
        // this.emit(':responseReady');
    },
    'LaunchIntent': function(){
        this.handler.state = STATES.ATTACK;
        this.emit(':ask', "<audio src='https://s3.amazonaws.com/joey-sound-effects/royal-trumpets.mp3'/> Hello young knight. Lets see if we can knock your opponent off their noble steed. You'll be facing, the " + randomOppenent + ". Prepare your lance. Will you be attacking the body or head.");
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};

const attackStateHandlers = Alexa.CreateStateHandler(STATES.ATTACK, {
    'AttackIntent': function(){
        var speechText = null;
       if (this.event.request.intent.slots.attack.value == 'head'){
           this.attributes['attack'] = 'head';
           speechText = 'Your attacking the head. Now choose what you ar going to '; 
       }
       else if (this.event.request.intent.slots.attack.value == 'body'){
           this.attributes['attack'] = 'body';
           speechText = 'Your attacking the body. Are you going to protect your body or your head?'; 
       }
       this.emit(':ask', speechText); 
    }
});
