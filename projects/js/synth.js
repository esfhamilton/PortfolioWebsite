// Initialising each scale
// MAJORS
// C Major: C D E F G A B
let C = {90:'C1',88:'D1',67:'E1',86:'F1',66:'G1',78:'A1',77:'B1',
         65:'C2',83:'D2',68:'E2',70:'F2',71:'G2',72:'A2',74:'B2',
         81:'C3',87:'D3',69:'E3',82:'F3',84:'G3',89:'A3',85:'B3',
         49:'C4',50:'D4',51:'E4',52:'F4',53:'G4',54:'A4',55:'B4',56:'C5'};
// G Major: G A B C D E F# 
let G = {90:'G1',88:'A1',67:'B1',86:'C2',66:'D2',78:'E2',77:'F#2',
         65:'G2',83:'A2',68:'B2',70:'C3',71:'D3',72:'E3',74:'F#3',
         81:'G3',87:'A3',69:'B3',82:'C4',84:'D4',89:'E4',85:'F#4',
         49:'G4',50:'A4',51:'B4',52:'C5',53:'D5',54:'E5',55:'F#5',56:'G5'};
// D Major: D E F# G A B C#
let D = {90:'D1',88:'E1',67:'F#1',86:'G1',66:'A1',78:'B1',77:'C#2',
         65:'D2',83:'E2',68:'F#2',70:'G2',71:'A2',72:'B2',74:'C#3',
         81:'D3',87:'E3',69:'F#3',82:'G3',84:'A3',89:'B3',85:'C#4',
         49:'D4',50:'E4',51:'F#4',52:'G4',53:'A4',54:'B4',55:'C#5',56:'D5'};
// A Major: A B C# D E F# G# 
let A = {90:'A1',88:'B1',67:'C#2',86:'D2',66:'E2',78:'F#2',77:'G#2',
         65:'A2',83:'B2',68:'C#3',70:'D3',71:'E3',72:'F#3',74:'G#3',
         81:'A3',87:'B3',69:'C#4',82:'D4',84:'E4',89:'F#4',85:'G#4',
         49:'A4',50:'B4',51:'C#5',52:'D5',53:'E5',54:'F#5',55:'G#5',56:'A5'};
// E Major: E F# G# A B C# D#
let E = {90:'E1',88:'F#1',67:'G#1',86:'A1',66:'B1',78:'C#2',77:'D#2',
         65:'E2',83:'F#2',68:'G#2',70:'A2',71:'B2',72:'C#3',74:'D#3',
         81:'E3',87:'F#3',69:'G#3',82:'A3',84:'B3',89:'C#4',85:'D#4',
         49:'E4',50:'F#4',51:'G#4',52:'A4',53:'B4',54:'C#5',55:'D#5',56:'E5'};
// B Major: B C# D# E F# G# A# 
let B = {90:'B1',88:'C#2',67:'D#2',86:'E2',66:'F#2',78:'G#2',77:'A#2',
         65:'B2',83:'C#3',68:'D#3',70:'E3',71:'F#3',72:'G#3',74:'A#3',
         81:'B3',87:'C#4',69:'D#4',82:'E4',84:'F#4',89:'G#4',85:'A#4',
         49:'B4',50:'C#5',51:'D#5',52:'E5',53:'F#5',54:'G#5',55:'A#5',56:'B5'};
// F Major: F G A Bb C D E
let F = {90:'F1',88:'G1',67:'A1',86:'Bb1',66:'C2',78:'D2',77:'E2',
         65:'F2',83:'G2',68:'A2',70:'Bb2',71:'C3',72:'D3',74:'E3',
         81:'F3',87:'G3',69:'A3',82:'Bb3',84:'C4',89:'D4',85:'E4',
         49:'F4',50:'G4',51:'A4',52:'Bb4',53:'C5',54:'D5',55:'E5',56:'F5'};
// MINORS
// A Minor: A B C D E F G 
let Am = {90:'A1',88:'B1',67:'C2',86:'D2',66:'E2',78:'F2',77:'G2',
          65:'A2',83:'B2',68:'C3',70:'D3',71:'E3',72:'F3',74:'G3',
          81:'A3',87:'B3',69:'C4',82:'D4',84:'E4',89:'F4',85:'G4',
          49:'A4',50:'B4',51:'C5',52:'D5',53:'E5',54:'F5',55:'G5',56:'A5'};
// E Minor: E F# G A B C D
let Em = {90:'E1',88:'F#1',67:'G1',86:'A1',66:'B1',78:'C2',77:'D2',
          65:'E2',83:'F#2',68:'G2',70:'A2',71:'B2',72:'C3',74:'D3',
          81:'E3',87:'F#3',69:'G3',82:'A3',84:'B3',89:'C4',85:'D4',
          49:'E4',50:'F#4',51:'G4',52:'A4',53:'B4',54:'C5',55:'D5',56:'E5'};
// B Minor: B C# D E F# G A 
let Bm = {90:'B1',88:'C#2',67:'D2',86:'E2',66:'F#2',78:'G2',77:'A2',
          65:'B2',83:'C#3',68:'D3',70:'E3',71:'F#3',72:'G3',74:'A3',
          81:'B3',87:'C#4',69:'D4',82:'E4',84:'F#4',89:'G4',85:'A4',
          49:'B4',50:'C#5',51:'D5',52:'E5',53:'F#5',54:'G5',55:'A5',56:'B5'};
// D Minor: D E F G A Bb C
let Dm = {90:'D1',88:'E1',67:'F1',86:'G1',66:'A1',78:'Bb1',77:'C2',
          65:'D2',83:'E2',68:'F2',70:'G2',71:'A2',72:'Bb2',74:'C3',
          81:'D3',87:'E3',69:'F3',82:'G3',84:'A3',89:'Bb3',85:'C4',
          49:'D4',50:'E4',51:'F4',52:'G4',53:'A4',54:'Bb4',55:'C5',56:'D5'};
// G Minor: G A Bb C D Eb F 
let Gm = {90:'G1',88:'A1',67:'Bb1',86:'C2',66:'D2',78:'Eb2',77:'F2',
          65:'G2',83:'A2',68:'Bb2',70:'C3',71:'D3',72:'Eb3',74:'F3',
          81:'G3',87:'A3',69:'Bb3',82:'C4',84:'D4',89:'Eb4',85:'F4',
          49:'G4',50:'A4',51:'Bb4',52:'C5',53:'D5',54:'Eb5',55:'F5',56:'G5'};
// C Minor: C D Eb F G Ab Bb
let Cm = {90:'C1',88:'D1',67:'Eb1',86:'F1',66:'G1',78:'Ab1',77:'Bb1',
          65:'C2',83:'D2',68:'Eb2',70:'F2',71:'G2',72:'Ab2',74:'Bb2',
          81:'C3',87:'D3',69:'Eb3',82:'F3',84:'G3',89:'Ab3',85:'Bb3',
          49:'C4',50:'D4',51:'Eb4',52:'F4',53:'G4',54:'Ab4',55:'Bb4',56:'C5'};
// F Minor: F G Ab Bb C Db Eb
let Fm = {90:'F1',88:'G1',67:'Ab1',86:'Bb1',66:'C2',78:'Db2',77:'Eb2',
          65:'F2',83:'G2',68:'Ab2',70:'Bb2',71:'C3',72:'Db3',74:'Eb3',
          81:'F3',87:'G3',69:'Ab3',82:'Bb3',84:'C4',89:'Db4',85:'Eb4',
          49:'F4',50:'G4',51:'Ab4',52:'Bb4',53:'C5',54:'Db5',55:'Eb5',56:'F5'};          

// Nested object allows form to map to a scale object 
let scales = {"C":C,"D":D,"E":E,"F":F,"G":G,"A":A,"B":B,
              "Cm":Cm,"Dm":Dm,"Em":Em,"Fm":Fm,"Gm":Gm,"Am":Am,"Bm":Bm};

// Initialises the default scale as C Major
let scale = "C";

// Used to sharpen a note
let sharpen = false;

function updateScale(){
    var e = document.getElementById("scaleDropDown");
    scale = e.options[e.selectedIndex].value;
}

// Defines the attributes for the synthesiser 
let synth = new Tone.Synth({
    oscillator: {
    type: 'fmsquare',
    modulationType: 'triangle',
    modulationIndex: 2,
    harmonicity: 3
  },
  envelope: {
    attack: 0.001,
    decay: 0,
    sustain: 2,
    release: 5
  }
}).toMaster();

// Defines attributes for drum kick
let kick = new Tone.MembraneSynth({
    effects: [],
    sound: {
        volume: -1,
        envelope: {
            attack: 0.01,
            decay:0.01,
            sustain: 0.01
        },
    },
}).toMaster();

//https://codepen.io/bbx/pen/zLybde

// Prevents spontaneous ear drum combustion
synth.volume.value = -30;

// Called when a key is pressed down
document.addEventListener('keydown', function(e) {
    // Prevents keydown changing scale selected
    let scaleDropDown = document.getElementById("scaleDropDown");
    scaleDropDown.blur();
    let key = e.keyCode;
    
    // Check if shift is released
    if(key == 16){
        sharpen = true;
    }
    
    if(scales[scale][key]!=undefined){
        if(sharpen){
            console.log(scales[scale][key][0]);
        }
        else{
            synth.triggerAttack(scales[scale][key]);
        }
    }
});

// Called when a key is released
document.addEventListener('keyup', function(e) {
    // Check if shift has been released
    if(e.keyCode == 16){
        sharpen = false;
    }
    // Stops the note playing infinitely
    synth.triggerRelease();
});