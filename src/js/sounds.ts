let audioContext: AudioContext | undefined

function getAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext()
  } else if (audioContext.state === "suspended") {
    void audioContext.resume()
  }
  return audioContext
}

export function playBuzzer() {
  const pulseTime = 3

  const audioCtx = getAudioContext()

  const oscillator = audioCtx.createOscillator()
  oscillator.type = "sine"
  oscillator.frequency.value = 880

  const amp = audioCtx.createGain()
  amp.gain.value = 1

  const lfo = audioCtx.createOscillator()
  lfo.type = "square"
  lfo.frequency.value = 30

  lfo.connect(amp.gain)
  oscillator.connect(amp).connect(audioCtx.destination)
  lfo.start()
  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + pulseTime)

  oscillator.onended = () => {
    oscillator.disconnect()
    amp.disconnect()
  }
}

interface Note {
  frequency: number
  duration: number
  startTime: number
}

function playNote(audioCtx: AudioContext, currentTime: number, note: Note) {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  const startTime = currentTime + note.startTime
  const {frequency, duration} = note

  oscillator.frequency.setValueAtTime(frequency, startTime)
  oscillator.type = "sawtooth"

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  // Set volume envelope
  gainNode.gain.setValueAtTime(0, startTime) // Start with no volume
  gainNode.gain.linearRampToValueAtTime(0.9, startTime + 0.05) // Quick attack
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration) // Fade out

  oscillator.start(startTime) // Start the oscillator
  oscillator.stop(startTime + duration) // Stop the oscillator after the duration

  oscillator.onended = () => {
    oscillator.disconnect()
    gainNode.disconnect()
  }
}

export function playFinish() {
  const audioCtx = getAudioContext()
  const currentTime = audioCtx.currentTime

  const notes = [
    {frequency: 523.25, duration: 0.1, startTime: 0}, // C5
    {frequency: 659.25, duration: 0.1, startTime: 0.1}, // E5
    {frequency: 783.99, duration: 0.1, startTime: 0.2}, // G5
    {frequency: 880.0, duration: 0.5, startTime: 0.3}, // A5 (final bright note)
  ]

  notes.forEach((note) => {
    playNote(audioCtx, currentTime, note)
  })
}
