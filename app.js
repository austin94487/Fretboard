(function() {
    const root = document.documentElement;
    const fretboard = document.querySelector('.fretboard');
    const instrumentSelector = document.querySelector('#instrument-selector');
    const accidentalSelector = document.querySelector('.accidental-selector');
    const numberOfFretsSelector = document.querySelector('#number-of-frets');
    const showAllNotesSelector = document.querySelector('#show-all-notes');
    const showMultipleNotesSelector = document.querySelector('#show-multiple-notes');
    const selectNotesSelector = document.querySelector('#select-notes');
    const noteNameSection = document.querySelector('.note-name-section');
    const chordSearchButton = document.querySelector('#search-chord')
    const chordDisplayArea = document.querySelector('#chord-display')
    const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleFretMarkPositions = [12,24];
    const notesFlat = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
    const notesSharp = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const instrumentTuningPresets = {
        'Guitar': [4, 11, 7, 2, 9, 4], // E, A, D, G, B, E
        'Bass (4 strings)': [7, 2, 9, 4],
        'Bass (5 strings)': [7, 2, 9, 4, 11],
        'Ukulele': [9, 4, 0, 7]
    };
    let selectedNotes = {}

    let allNotes;
    let showMultipleNotes = false;
    let selectingNotes = false;
    let showAllNotes = false;
    let numFrets = 12;
    let accidentals = 'sharps';
    let selectedInstrument = "Guitar";
    let numStrings = instrumentTuningPresets[selectedInstrument].length;

    const app = {
        init() {
            this.setupFretboard();
            this.setupInstrumentSelector();
            this.setupNoteNameSection();
            handlers.setupEventListeners();
        },
        setupFretboard() {
            // empty (reset) Fretboard
            fretboard.innerHTML = '';

            root.style.setProperty('--num-strings', numStrings);
            // Add strings to Fretboard
            for (let i = 0; i < numStrings; i++) {
                let string = tools.createElement('div');
                string.classList.add('string');
                fretboard.appendChild(string);

                // Create frets
                for (let fret = 0; fret <= numFrets; fret++) {
                    let noteFret = tools.createElement('div');
                    noteFret.classList.add('note-fret');
                    string.appendChild(noteFret);

                    let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]))
                    noteFret.setAttribute('data-note', noteName);
                    noteFret.setAttribute('string-number', i+1)
                    noteFret.setAttribute('fret-number', fret)

                    // Add fret marks
                    if (i == 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                        noteFret.classList.add('single-fretmark');
                    } else if (i == 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                        let doubleFretMark = tools.createElement('div');
                        doubleFretMark.classList.add('double-fretmark');
                        noteFret.appendChild(doubleFretMark);
                    }
                }
            }
            allNotes = document.querySelectorAll('.note-fret');
        },
        generateNoteNames(noteIndex) {
            noteIndex = noteIndex % 12;
            let noteName;
            if (accidentals === 'flats') {
                noteName = notesFlat[noteIndex];
            } else if (accidentals === 'sharps') {
                noteName = notesSharp[noteIndex];
            }
            return noteName;
        },
        setupInstrumentSelector() {
            for (instrument in instrumentTuningPresets) {
                let instrumentOption = tools.createElement('option', instrument);
                instrumentSelector.appendChild(instrumentOption);
            }
        },
        setupNoteNameSection() {
            noteNameSection.innerHTML = '';
            let noteNames;
            if(accidentals === 'flats') {
                noteNames = notesFlat;
            } else {
                noteNames = notesSharp;
            }
            noteNames.forEach((noteName) => {
                let noteNameElement = tools.createElement('span', noteName);
                noteNameSection.appendChild(noteNameElement);
            });
        },
        toggleMultipleNotes(noteName, opacity) {
            for (let i = 0; i < allNotes.length; i++) {
                if (allNotes[i].dataset.note === noteName) {
                    allNotes[i].style.setProperty('--noteDotOpacity', opacity);
                }
            }
        }
    }

    const handlers = {
        selectNote(event) {
            if (!selectingNotes) {
                return;
            }
            if (event.target.classList.contains('note-fret')) {
                let string_number = event.target.getAttribute('string-number')
                let fret_number = event.target.getAttribute('fret-number')
                if (!(string_number in selectedNotes)) {
                    selectedNotes[string_number] = fret_number
                } else if (selectedNotes[string_number] == fret_number) {
                    delete selectedNotes[string_number];
                    event.target.style.setProperty('--noteDotOpacity', 0);
                } 
            }
        },
        showNoteDot(event) {
            // check if showAllNotes is selectedInstrument
            if(showAllNotes) {
                return;
            }
            if (event.target.classList.contains('note-fret')) {
                if (showMultipleNotes) {
                    app.toggleMultipleNotes(event.target.dataset.note, 1);
                } else {
                    event.target.style.setProperty('--noteDotOpacity', 1);
                }
            }
        },
        hideNoteDot(event) {
            // check if showAllNotes is selectedInstrument
            if (selectingNotes && (selectedNotes[event.target.getAttribute('string-number')] == event.target.getAttribute('fret-number'))) {
                return;
            }
            if(showAllNotes) {
                return;
            }
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 0);
            } else {
                event.target.style.setProperty('--noteDotOpacity', 0);
            }

        },
        setSelectedInstrument(event) {
            selectedInstrument = event.target.value;
            numStrings = instrumentTuningPresets[selectedInstrument].length;
            app.setupFretboard();
        },
        setAccidentals(event) {
            if (event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                app.setupFretboard();
                app.setupNoteNameSection();    
                let fretboard = document.getElementById('fretboard')
                let strings = fretboard.getElementsByClassName("note-fret")
                for (let i = 0; i < strings.length; i++) {
                    if (strings[i].getAttribute('string-number') in selectedNotes && (selectedNotes[strings[i].getAttribute('string-number')] == strings[i].getAttribute('fret-number'))) {
                        strings[i].style.setProperty('--noteDotOpacity', 1) 
                    }
                }
            } else {
                return;
            }
        },
        setNumberOfFrets () {
            numFrets = numberOfFretsSelector.value;
            app.setupFretboard();
            let fretboard = document.getElementById('fretboard')
            let strings = fretboard.getElementsByClassName("note-fret")
            for (let i = 0; i < strings.length; i++) {
                if (strings[i].getAttribute('string-number') in selectedNotes && (selectedNotes[strings[i].getAttribute('string-number')] == strings[i].getAttribute('fret-number'))) {
                    strings[i].style.setProperty('--noteDotOpacity', 1) 
                }
            }

        },
        setShowAllNotes () {
            if (selectingNotes) {
                selectingNotes = false;
                selectedNotes = {}
                document.getElementById("select-notes").checked = false;
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }
            showAllNotes = showAllNotesSelector.checked;
            if (showAllNotes) {
                root.style.setProperty('--noteDotOpacity', 1);
                app.setupFretboard();
            } else {
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }
        },
        setSelectNotes() {
            if (showMultipleNotes) {
                showMultipleNotes = false;
                document.getElementById("show-multiple-notes").checked = false;
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }

            if (showAllNotes) {
                showAllNotes = false;
                document.getElementById("show-all-notes").checked = false;
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }

            selectingNotes = selectNotesSelector.checked;
            if (!selectingNotes) {
                root.style.setProperty('--noteDotOpacity', 0);
                selectedNotes = {}    
                chordDisplayArea.setAttribute("value", "guitar only"); 
                app.setupFretboard();
            } else {
                let fretboard = document.getElementById('fretboard')
                let strings = fretboard.getElementsByClassName("note-fret")
                for (let i = 0; i < strings.length; i++) {
                    if (strings[i].getAttribute('fret-number') == 0) {
                        let string_number = strings[i].getAttribute('string-number')
                        let fret_number = strings[i].getAttribute('fret-number')
                        selectedNotes[string_number] = fret_number
                        strings[i].style.setProperty('--noteDotOpacity', 1) 
                    }
                }
            }

        },
        setShowMultipleNotes () {
            if (selectingNotes) {
                selectingNotes = false;
                selectedNotes = {}
                document.getElementById("select-notes").checked = false;
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }
            showMultipleNotes = !showMultipleNotes;
        },
        setNotesToShow(event) {
            if (selectingNotes) {
                return;
            }
            let noteToShow = event.target.innerText;
            app.toggleMultipleNotes(noteToShow, 1);
        },
        setNotesToHide(event) {
            if (selectingNotes) {
                return;
            }
            if(!showAllNotes) {
                let noteToHide = event.target.innerText;
                app.toggleMultipleNotes(noteToHide, 0);
            } else {
                return;
            }
        },
        setupEventListeners() {
            fretboard.addEventListener('mouseover', this.showNoteDot);
            fretboard.addEventListener('mouseout', this.hideNoteDot);
            fretboard.addEventListener('click', this.selectNote)
            instrumentSelector.addEventListener('change', this.setSelectedInstrument);
            accidentalSelector.addEventListener('click', this.setAccidentals);
            numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);
            showAllNotesSelector.addEventListener('change', this.setShowAllNotes);
            showMultipleNotesSelector.addEventListener('change', this.setShowMultipleNotes);
            selectNotesSelector.addEventListener('change', this.setSelectNotes)
            noteNameSection.addEventListener('mouseover', this.setNotesToShow);
            noteNameSection.addEventListener('mouseout', this.setNotesToHide);
            chordSearchButton.addEventListener('click', searchForChord);
        }
    }

    const searchForChord = async () => {
        if (selectingNotes) {
            if (instrumentSelector.value != "Guitar") {    
                chordDisplayArea.setAttribute("value", "please select guitar"); 
                return;
            }
            if (Object.keys(selectedNotes).length == 0) {
                chordDisplayArea.setAttribute("value", "select notes first"); 
                return;
            }
            let queryChord = "";
            for (let i=6; i>=1;i--) {
                if (i.toString() in selectedNotes) {
                    if (i != 1) {
                        queryChord = queryChord + selectedNotes[i] + "-";
                    } else {
                        queryChord = queryChord + selectedNotes[i]
                    }

                } else {
                    if (i != 1) {
                        queryChord = queryChord + "X-"
                    } else {
                        queryChord = queryChord + "X"
                    }
                    
                }
            }
            // USING UberChord API
            const response = await fetch("https://api.uberchord.com/v1/chords?voicing=" + queryChord);
            const myJson = await response.json(); //extract JSON from the http response and then return it
            const resArray = myJson[0].chordName.split(",");

            // create string from response array
            let responseChord = resArray[0]
            if (resArray[1] != "") {
                responseChord = responseChord + " " + resArray[1];
            } else if (resArray[1] != "unknown") {    
                chordDisplayArea.setAttribute("value", "unknown chord"); 
            }
            if (resArray[2] != "" || resArray != "unknown") {
                responseChord = responseChord + " " + resArray[2];
            }
            if (resArray[3] != "" || resArray != "unknown") {
                console.log(resArray)
                responseChord = responseChord + " / " + resArray[3];
            }
            chordDisplayArea.setAttribute("value", responseChord); 
        } else {
            chordDisplayArea.setAttribute("value", "select notes first")
        }
    }

    const tools = {
        createElement(element, content) {
            element = document.createElement(element);
            if(arguments.length > 1) {
                element.innerHTML = content;
            }
            return element;
        }
    }

    app.init();
})();
