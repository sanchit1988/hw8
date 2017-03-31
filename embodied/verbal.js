/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500
var slowEyeColor = "black"
var fastEyeColor = "red"

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);
      setEyeColor(fastEyeColor);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
        setEyeColor(slowEyeColor);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;

  if (user_said.toLowerCase().includes("weather in") && user_said.toLowerCase().includes("and")) {
    var weather_re1 = /weather in\s(.+)\sand\s(.+)/i;  // creating a regular expression
    var mcity_parse_array = user_said.match(weather_re1) // parsing the input string with the regular expression
    console.log(mcity_parse_array) // let's print the array content to the console log so we understand what's inside the array.
    response = "Weather in " + mcity_parse_array[1] + "is rainy" + "and weather in" + mcity_parse_array[2] + "is cloudy";
    }
    else if (user_said.toLowerCase().includes("weather in")) {
    var weather_re2 = /weather in\s(.+)/i;  // creating a regular expression
    var city_parse_array = user_said.match(weather_re2) // parsing the input string with the regular expression
    console.log(city_parse_array)
    response = "Weather in " + city_parse_array[1] + "is rainy";
    }
    else if (user_said.toLowerCase().includes("weather outside")) {
    response = "Weather in San Francisco is rainy";
    }    
    else if (user_said.toLowerCase().includes("weather forecast")) {
    response = "Weather in San Francisco is rainy";
    }     
    else if (user_said.toLowerCase().includes("is the weather")) {
    var type_re = /is the weather\s(.*)/i;  // creating a regular expression
    var type_parse_array = user_said.match(type_re) // parsing the input string with the regular expression
    console.log(type_parse_array)
    response = "Yes, Weather in San Francisco is" + type_parse_array[1];
    } 
    else if (user_said.toLowerCase().includes("bye")) {
    response = "good bye to you!";
    state = "initial"
    } else {
    response = "i don't get it";
    }
    return response;
}

/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 1 //between 0.1
  u.pitch = 2.0 //between 0 and 2
  u.rate = 1 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Karen"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
