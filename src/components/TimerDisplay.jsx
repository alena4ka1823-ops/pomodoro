import { formatTime } from '../utils/formatTime'

const RADIUS = 118
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Круговой индикатор прогресса + цифры таймера
export function TimerDisplay({ secondsLeft, totalSeconds, isRunning }) {
  // Смещение обводки: 0 в начале (кольцо полное) -> CIRCUMFERENCE в конце
  const offset = CIRCUMFERENCE * (1 - secondsLeft / totalSeconds)

  return (
    <div className="timer">
      <svg className="timer__ring" width="260" height="260">
        <circle
          className="timer__track"
          cx="130"
          cy="130"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
        />
        <circle
          className="timer__progress"
          cx="130"
          cy="130"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="timer__content">
        <span className="timer__digits">{formatTime(secondsLeft)}</span>
        <span className="timer__state">{isRunning ? 'Идёт' : 'Пауза'}</span>
      </div>
    </div>
  )
}
