import { MODES } from '../constants'

// Переключатель режимов (Помидор / Короткий перерыв / Длинный перерыв)
export function ModeTabs({ activeKey, onSelect }) {
  return (
    <div className="tabs">
      {Object.entries(MODES).map(([key, { label }]) => (
        <button
          key={key}
          className={'tab' + (key === activeKey ? ' tab--active' : '')}
          onClick={() => onSelect(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
