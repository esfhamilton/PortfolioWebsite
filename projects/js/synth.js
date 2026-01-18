function createScale(notes) {
    const keys = [90,88,67,86,66,78,77,65,83,68,70,71,72,74,81,87,69,82,84,89,85,49,50,51,52,53,54,55,56];
    const octaves = [1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5];
    
    let scale = {};
    for (let i = 0; i < keys.length; i++) {
        scale[keys[i]] = notes[i % notes.length] + octaves[i];
    }
    return scale;
}

const scalePatterns = {
    'C': ['C','D','E','F','G','A','B'],
    'G': ['G','A','B','C','D','E','Gb'],
    'D': ['D','E','Gb','G','A','B','Db'],
    'A': ['A','B','Db','D','E','Gb','Ab'],
    'E': ['E','Gb','Ab','A','B','Db','Eb'],
    'B': ['B','Db','Eb','E','Gb','Ab','Bb'],
    'F': ['F','G','A','Bb','C','D','E'],
    'Am': ['A','B','C','D','E','F','G'],
    'Em': ['E','Gb','G','A','B','C','D'],
    'Bm': ['B','Db','D','E','Gb','G','A'],
    'Dm': ['D','E','F','G','A','Bb','C'],
    'Gm': ['G','A','Bb','C','D','Eb','F'],
    'Cm': ['C','D','Eb','F','G','Ab','Bb'],
    'Fm': ['F','G','Ab','Bb','C','Db','Eb']
};

let scales = {};
Object.keys(scalePatterns).forEach(key => {
    scales[key] = createScale(scalePatterns[key]);
});
let scale = "C";
let sharpen = false;

function updateScale(){
    var e = document.getElementById("scaleDropDown");
    scale = e.options[e.selectedIndex].value;
}

let synth = new Tone.PolySynth().toMaster();
synth.set({
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
});

synth.volume.value = -9;

let activeNotes = new Set();

function getSharpenedNote(note) {
    return (note[1]=='b') ? note[0]+note[2] : note[0]+"#"+note[1];
}

function handleKeyEvent(e, isKeyDown) {
    let scaleDropDown = document.getElementById("scaleDropDown");
    scaleDropDown.blur();
    let key = e.keyCode;

    if(key == 16){
        sharpen = isKeyDown ? true : false;
        return;
    }

    if(scales[scale][key] !== undefined && activeNotes.has(key) !== isKeyDown){
        let note = scales[scale][key];
        if(sharpen){
            note = getSharpenedNote(note);
        }
        
        if(isKeyDown){
            synth.triggerAttack(note);
            activeNotes.add(key);
        } else {
            synth.triggerRelease(note);
            activeNotes.delete(key);
        }
    }
}

document.addEventListener('keydown', function(e) {
    handleKeyEvent(e, true);
});

document.addEventListener('keyup', function(e) {
    handleKeyEvent(e, false);
});

class DrumMachine {
    constructor() {
        this.drumNames = ['KICK', 'HH', 'HHO', 'SNARE', 'RIM', 'COWBELL', 'BASS'];
        this.drumFiles = ['kick', 'hhclosed', 'hhopen', 'snare', 'rimshot', 'cowbell', 'bass'];
        this.numBeats = 16;
        this.currentBeat = 0;
        this.isPlaying = false;
        this.interval = null;
        this.bpm = 100;
        this.beats = [
            [1,0,0,0,1,0,0,0,0,1,1,1,0,1,0],
            [1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0]
        ];
        this.buffers = [];
        this.init();
    }

    loadSounds() {
        this.buffers = [];
        
        this.drumFiles.forEach((file, index) => {
            const buffer = new Tone.Buffer(
                `../resources/audio/DrumKit/${file}.wav`,
                () => {
                    this.buffers[index] = buffer;
                },
                (e) => console.error(`Failed to load ${file}:`, e)
            );
        });
    }

    createGrid() {
        const grid = document.getElementById('drumGrid');
        grid.innerHTML = '';
        
        for (let row = 0; row < this.drumNames.length; row++) {
            const label = document.createElement('div');
            label.className = 'drum-label';
            label.textContent = this.drumNames[row];
            label.style.gridColumn = '1';
            label.style.gridRow = (row + 1).toString();
            grid.appendChild(label);
            
            for (let col = 0; col < this.numBeats; col++) {
                const cell = document.createElement('div');
                cell.className = 'drum-cell';
                cell.style.gridColumn = (col + 2).toString();
                cell.style.gridRow = (row + 1).toString();
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.beats[row][col] === 1) {
                    cell.classList.add('active');
                }
                
                cell.addEventListener('click', () => this.toggleCell(row, col));
                grid.appendChild(cell);
            }
        }
    }

    toggleCell(row, col) {
        this.beats[row][col] = this.beats[row][col] === 1 ? 0 : 1;
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.toggle('active');
    }

    setupControls() {
        const playBtn = document.getElementById('drumPlay');
        const stopBtn = document.getElementById('drumStop');
        const bpmSlider = document.getElementById('bpmSlider');
        const bpmDisplay = document.getElementById('bpmDisplay');

        playBtn.addEventListener('click', async () => {
            await Tone.start();
            this.start();
        });
        
        stopBtn.addEventListener('click', () => {
            this.stop();
        });
        
        bpmSlider.addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            bpmDisplay.textContent = this.bpm;
            if (this.isPlaying) {
                this.stop();
                this.start();
            }
        });
    }

    start() {
        if (this.isPlaying) return;
        
        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }
        
        this.isPlaying = true;
        const intervalTime = 60000 / (this.bpm * 4);
        
        this.interval = setInterval(() => {
            this.playBeat();
            this.currentBeat = (this.currentBeat + 1) % this.numBeats;
        }, intervalTime);
    }

    stop() {
        this.isPlaying = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.currentBeat = 0;
        this.updateDisplay();
    }

    playBeat() {
        for (let row = 0; row < this.drumNames.length; row++) {
            if (this.beats[row][this.currentBeat] === 1 && this.buffers[row] && this.buffers[row].loaded) {
                const source = new Tone.BufferSource(this.buffers[row]).connect(Tone.Master);
                source.start(0);
            }
        }
        this.updateDisplay();
    }

    updateDisplay() {
        document.querySelectorAll('.drum-cell').forEach(cell => {
            cell.classList.remove('playing');
            if (parseInt(cell.dataset.col) === this.currentBeat) {
                cell.classList.add('playing');
            }
        });
    }

    async init() {
        this.loadSounds();
        this.createGrid();
        this.setupControls();
        this.updateDisplay();
    }
}

let drumMachine;

document.addEventListener('DOMContentLoaded', () => {
    Tone.start();
    drumMachine = new DrumMachine();
});