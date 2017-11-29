'use strict';
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

const APP_ID = 'amzn1.ask.skill.07192ea1-da61-4773-943b-71d0286f6049';

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'joustTable';
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, AttackProtectHandlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('LaunchIntent');
    },
    'LaunchIntent': function(){
        var opponents = ['White knight of Vadjeron', 'Justice warrior of Triggermore', 'Emerald knight of High-Castle', 'Crimson knight of South-Shire', 'Gold knight of the Holy-Woods', 'Stickman of Merrca'];
        var randomOpponent = opponents[Math.floor(Math.random() * 6)];
        var bodyParts = ['head', 'body'];
        var enemyAttPro = [bodyParts[Math.round(Math.random())], bodyParts[Math.round(Math.random())]];
        this.attributes['opponent'] = randomOpponent;
        this.attributes['enemyAttPro'] = enemyAttPro;
        this.attributes['attack'] = null;
        this.attributes['protect'] = null;
        this.response.speak("<audio src='https://s3.amazonaws.com/joey-sound-effects/royal-trumpets.mp3'/> Hello worthy knight. Lets see if we can knock your opponent off their steed. You'll be facing, the " + randomOpponent + ". Prepare your lance. Will you be attacking the body or head.").listen('Please say head or body.');
        this.emit(':responseReady');
    },
    'PlayAgainIntent': function() {
        var opponents = ['White knight of Vadjeron', 'Justice warrior of Triggermore', 'Emerald knight of High-Castle', 'Crimson knight of South-Shire', 'Gold knight of the Holy-Woods', 'Stickman of Merrca'];
        var randomOpponent = opponents[Math.floor(Math.random() * 6)];
        var bodyParts = ['head', 'body'];
        var enemyAttPro = [bodyParts[Math.round(Math.random())], bodyParts[Math.round(Math.random())]];
        this.attributes['opponent'] = randomOpponent;
        this.attributes['enemyAttPro'] = enemyAttPro;
        this.attributes['attack'] = null;
        this.attributes['protect'] = null;
        this.response.speak("You will now be facing, the " + randomOpponent + ". Goodluck. Will you be attacking your opponents body or head.").listen('Please say head or body.');
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("All you need to do is specify head or body when attacking your opponent or protect yourself from your opponents attacks.");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that.");
    },
    'AttackIntent': function(){
        var speechText = null;
        var attackPart = this.event.request.intent.slots.attack.value;
        if (attackPart == 'head' &&  this.attributes['attack'] == null ){
           this.attributes['attack'] = 'head';
           this.emit('AttackHead');            
        }
       else if (attackPart == 'body' &&  this.attributes['attack'] == null){   
           this.attributes['attack'] = 'body';
           this.emit('AttackBody');
        }
        else if(attackPart == 'head' &&  this.attributes['attack'] != null) {
            this.attributes['protect'] = 'head';
            this.emit('ProtectHead');
        }
        else if(attackPart == 'body' &&  this.attributes['attack'] != null) {
            this.attributes['protect'] = 'body';
            this.emit('ProtectBody');
        }
    },
    'AMAZON.YesIntent' : function() {
        this.emit('PlayAgainIntent');
    },
    'AMAZON.NoIntent' : function() {
        this.response.speak('see you next time');
        this.emit(':responseReady');
    },
};

const AttackProtectHandlers = {
    'AttackHead': function() {
        this.response.speak('Your attacking the head. Are you going to protect your body or head with your shield?')
        .listen('Please say head or body.');
        this.emit(':responseReady');
    },
    'AttackBody': function() {
        this.response.speak('Your attacking the body. Are you going to protect your body or head with your shield?')
        .listen('Please say head or body.');
        this.emit(':responseReady');
    },
    'ProtectHead': function() {
        if(this.attributes['attack'] ==  this.attributes['enemyAttPro'][1] &&  this.attributes['enemyAttPro'][0] != 'head'){
            //you lose
            this.response.speak("Your protecting your head. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Knight+Falls.mp3'/> <audio src='https://s3.amazonaws.com/joey-sound-effects/Crowd+gasping+sound+effect+in+shock+sound.mp3'/> Better luck next time. Would you like to play again?").listen('');
        }
        else if(this.attributes['attack'] !=  this.attributes['enemyAttPro'][1] &&  this.attributes['enemyAttPro'][0] == 'head'){
            //you win
            this.response.speak("Your protecting your head. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Knight+Falls.mp3'/> <audio src='https://s3.amazonaws.com/joey-sound-effects/stadium_crowd_cheering.mp3'/> You are victorious. Would you like to play again?").listen('');
        }
        else {
            //tie
            this.response.speak("Your protecting your head. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Pass+With+Contact.mp3'/> It's a draw. Would you like to play again?").listen('');
        }
        this.emit(':responseReady');
    },
    'ProtectBody': function() {
        if(this.attributes['attack'] ==  this.attributes['enemyAttPro'][1] &&  this.attributes['enemyAttPro'][0] != 'body'){
            //you lose
            this.response.speak("Your shielding your body. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Knight+Falls.mp3'/> <audio src='https://s3.amazonaws.com/joey-sound-effects/Crowd+gasping+sound+effect+in+shock+sound.mp3/> Better luck next time. Would you like to play again?").listen('');
        }
        else if(this.attributes['attack'] !=  this.attributes['enemyAttPro'][1] &&  this.attributes['enemyAttPro'][0] == 'body'){
            //you win
            this.response.speak("Your shielding your body. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Knight+Falls.mp3'/> <audio src='https://s3.amazonaws.com/joey-sound-effects/stadium_crowd_cheering.mp3'/> You are victorious. Would you like to play again?").listen('');
        }
        else {
            //tie
            this.response.speak("Your shielding your body. Goodluck. <audio src='https://s3.amazonaws.com/joey-sound-effects/Jousting+-+Pass+With+Contact.mp3'/> Its a draw. Would you like to play again?").listen('');
        }
        this.emit(':responseReady');
    },
};