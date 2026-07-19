import { useEffect } from 'react'
import { usePomodoro } from './hooks/usePomodoro'
import { ModeTabs } from './components/ModeTabs'
import { TimerDisplay } from './components/TimerDisplay'
import { Controls } from './components/Controls'
import { formatTime } from './utils/formatTime'

export default function App() {
  const {
    modeKey,
    mode,
    secondsLeft,
    totalSeconds,
    isRunning,
    completed,
    selectMode,
    toggle,
    reset,
  } = usePomodoro()

  // Акцентный цвет темы и заголовок вкладки — под текущий режим/состояние
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', mode.color)
    document.body.style.background = mode.bg
    document.title = isRunning
      ? `${formatTime(secondsLeft)} — ${mode.label}`
      : 'Pomodoro Timer'
  }, [mode, isRunning, secondsLeft])

  // Пробел — старт/пауза
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return (
    <div className="app">
      <h1 className="app__title">🍅 POMODORO</h1>
      <ModeTabs activeKey={modeKey} onSelect={selectMode} />
      <TimerDisplay
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        isRunning={isRunning}
      />
      <Controls isRunning={isRunning} onToggle={toggle} onReset={reset} />
      <p className="counter">
        Завершено помидоров: <b>{completed}</b>
      </p>
    </div>
  )
}
