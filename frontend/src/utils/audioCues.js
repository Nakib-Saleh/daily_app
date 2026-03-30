/**
 * Audio Cues — Web Audio API synthesized notification sounds.
 *
 * Two cues:
 *   1. Warning chime (1 minute remaining) — soft, double-ping bell
 *   2. Time's up chime — more prominent, triple-tone bell
 *
 * Uses OscillatorNode + GainNode for zero-dependency audio.
 * Respects a volume parameter (0–1).
 */

let audioCtx = null

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (browsers require user gesture first)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    return audioCtx
}

/**
 * Play a single tone with attack/decay envelope.
 * @param {number} frequency - Hz
 * @param {number} startTime - AudioContext time to start
 * @param {number} duration - seconds
 * @param {number} volume - 0 to 1
 * @param {string} type - oscillator type ('sine', 'triangle', etc.)
 */
function playTone(frequency, startTime, duration, volume, type = 'sine') {
    const ctx = getAudioContext()

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, startTime)

    // Gentle attack + decay envelope for a bell-like quality
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.02) // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration) // smooth decay

    // Optional: add a second harmonic for richness
    const harmonic = ctx.createOscillator()
    const harmonicGain = ctx.createGain()
    harmonic.type = 'sine'
    harmonic.frequency.setValueAtTime(frequency * 2, startTime) // octave up
    harmonicGain.gain.setValueAtTime(0, startTime)
    harmonicGain.gain.linearRampToValueAtTime(volume * 0.1, startTime + 0.02)
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.6)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    harmonic.connect(harmonicGain)
    harmonicGain.connect(ctx.destination)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
    harmonic.start(startTime)
    harmonic.stop(startTime + duration)
}

/**
 * Warning chime — soft double-ping. Plays at the 1-minute mark.
 * Two ascending tones: gentle "ding ding" reminder.
 * @param {number} volume - 0 to 1
 */
export function playWarningChime(volume = 0.5) {
    try {
        const ctx = getAudioContext()
        const now = ctx.currentTime

        // Two soft ascending pings
        playTone(880, now, 0.5, volume, 'sine')          // A5
        playTone(1047, now + 0.25, 0.5, volume, 'sine')  // C6
    } catch (e) {
        console.warn('Audio cue failed:', e)
    }
}

/**
 * Time's up chime — prominent triple-tone bell. Plays when timer reaches 0.
 * Three descending tones: clear "task complete" signal.
 * @param {number} volume - 0 to 1
 */
export function playTimesUpChime(volume = 0.5) {
    try {
        const ctx = getAudioContext()
        const now = ctx.currentTime

        // Three-note descending pattern with richer harmonics
        playTone(1047, now, 0.6, volume, 'sine')           // C6
        playTone(880, now + 0.3, 0.6, volume, 'sine')      // A5
        playTone(1047, now + 0.6, 0.8, volume, 'triangle') // C6 (resolved, longer)
    } catch (e) {
        console.warn('Audio cue failed:', e)
    }
}
