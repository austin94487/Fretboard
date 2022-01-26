# Online-Fretboard
This is a virtual fretboard that lets the user customize their view of the guitar fretboard.
The user can also view fretboards for a Ukelele and a 4-string and 5-string bass.
Some changes that I might implement in the future:
- Realistic string sizes (low E being the widest and high E being the smallest)
- Realistic fret sizes (decreasing down the fretboard)
- Realistic note and chord sounds using howler or tonal.js

This program also uses Uberchord API to search for common chords using user-inputted voicings.
To use the chord search feature, user must.
1) Select the "Select Notes" checkbox and have the Guitar instrument selected.
  - by default, notes for open E is selected.
2) Click active notes to unselect them and click on any other not to select. 
  - Unselecting a string is considered "muting" the string.
3) Click the "Search chord" button.

This program is inspired by Alejandro Tardín's React Guitar. 
