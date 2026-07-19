import { useState, useEffect, useCallback } from 'react'
import { MODES } from '../constants'
import { playBeep } from '../utils/playBeep'

// Вся логика таймера-помодоро: режим, отсчёт, старт/пауза, сброс, счётчик.
export function usePomodoro() {
  const [modeKey, setModeKey] = useState('pomodoro')
  const [secondsLeft, setSecondsLeft] = useState(MODES.pomodoro.minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(0)

  const mode = MODES[modeKey]
  const totalSeconds = mode.minutes * 60

  // Тик раз в секунду, пока таймер запущен
  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  // Завершение: остановка, сигнал, увеличение счётчика помидоров
  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return

    setIsRunning(false)
    playBeep()
    if (modeKey === 'pomodoro') {
      setCompleted((prev) => prev + 1)
    }
  }, [secondsLeft, isRunning, modeKey])

  const selectMode = useCallback((key) => {
    setModeKey(key)
    setSecondsLeft(MODES[key].minutes * 60)
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setSecondsLeft(MODES[modeKey].minutes * 60)
  }, [modeKey])

  return {
    modeKey,
    mode,
    secondsLeft,
    totalSeconds,
    isRunning,
    completed,
    selectMode,
    toggle,
    reset,
  }
}
