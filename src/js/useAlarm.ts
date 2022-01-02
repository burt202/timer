import {useCallback} from "react"

async function performAlarm(audioCtx: AudioContext) {
  if (audioCtx.state === "suspended") {
    await audioCtx.resume()
  }

  const pulseTime = 3

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
}

let audioContext: AudioContext | undefined

function getAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext()
  }

  return audioContext
}

export function useAlarm() {
  const ctx = getAudioContext()

  return useCallback(() => {
    // eslint-disable-next-line
    performAlarm(ctx)
  }, [ctx])
}
