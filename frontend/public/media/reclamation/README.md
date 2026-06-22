# Reclamation visualizer media

Place rendered visualizer videos and mastered audio files for the CKP Visualizer Core in this directory.

The current visualizer manifest expects filenames such as:

```txt
01-welcome-to-the-fire.mp4
01-welcome-to-the-fire.mp3
02-reclamation.mp4
02-reclamation.mp3
03-know-your-names.mp4
03-know-your-names.mp3
```

Update `frontend/src/data/reclamationVisualizerTracks.js` whenever the final filenames or track list change.

The center viewport plays rendered video. The audio element drives the Web Audio API analyser, which feeds FFT bands into the CSS variables and React Three Fiber shader layer.
