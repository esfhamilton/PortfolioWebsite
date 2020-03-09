// Load audio before activate() to prevent lag
const audio = new Audio('resources/audio/fanfare.wav');

// Mapping for key codes
const keys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

// The Code
const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// Tracks position in konamiCode
let konamiCodePosition = 0;

document.addEventListener('keydown', function(e) {
    // Get value of key code from keys
    let key = keys[e.keyCode];
    // Get value of next key from konamiCode
    let requiredKey = konamiCode[konamiCodePosition];

    // Increase position in konamiCode with each correct key press
    if (key == requiredKey) {
        konamiCodePosition++;
    
        // The code has been completed  
        if (konamiCodePosition == konamiCode.length) {
            activate();
            konamiCodePosition = 0;
        }
    } else {
        konamiCodePosition = 0;
      }
    });

    // The fun stuff
    function activate() {
        document.getElementById("heading").innerHTML = "IT'S DANGEROUS TO GO ALONE! TAKE THIS.";
        audio.play();
    }