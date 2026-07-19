// Кнопки управления: Старт/Пауза и Сброс
export function Controls({ isRunning, onToggle, onReset }) {
  return (
    <div className="controls">
      <button className="btn btn--primary" onClick={onToggle}>
        {isRunning ? 'Пауза' : 'Старт'}
      </button>
      <button className="btn btn--secondary" onClick={onReset}>
        Сброс
      </button>
    </div>
  )
}
