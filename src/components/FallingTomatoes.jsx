import { useRef, useEffect } from 'react'

const SPAWN_INTERVAL = 0.32 // секунды между появлением новых помидоров
const MAX_TOMATOES = 60 // ограничение, чтобы не копить слишком много
const DROP_GRAVITY = 2600 // ускорение при сбросе, px/сек²

// Один помидор со случайными параметрами падения
function createTomato(width) {
  const size = 24 + Math.random() * 20
  return {
    x: Math.random() * width,
    y: -size,
    vy: 50 + Math.random() * 70, // скорость падения, px/сек
    vx: (Math.random() - 0.5) * 40, // лёгкий снос вбок
    size,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 2, // вращение, рад/сек
  }
}

// Фоновый «дождь» из помидоров на весь экран.
// isRunning  — идёт ли отсчёт (падают / замирают).
// resetNonce — счётчик, увеличивается при сбросе (помидоры резко падают вниз).
export function FallingTomatoes({ isRunning, resetNonce }) {
  const canvasRef = useRef(null)
  const tomatoesRef = useRef([])
  const runningRef = useRef(isRunning)
  const droppingRef = useRef(false)
  const spawnAccRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef(0)
  const firstResetRef = useRef(true)

  // Держим актуальное состояние запуска доступным внутри цикла анимации
  useEffect(() => {
    runningRef.current = isRunning
  }, [isRunning])

  // Сброс: включаем режим резкого падения и подталкиваем помидоры вниз
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false
      return
    }
    droppingRef.current = true
    for (const t of tomatoesRef.current) {
      t.vy += 250
    }
  }, [resetNonce])

  // Основной цикл анимации на canvas — создаётся один раз
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    // Подгоняем размер canvas под экран с учётом плотности пикселей
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (time) => {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0
      lastTimeRef.current = time

      const w = window.innerWidth
      const h = window.innerHeight
      let tomatoes = tomatoesRef.current

      if (droppingRef.current) {
        // Сброс — все помидоры резко ускоряются вниз и улетают за экран
        for (const t of tomatoes) {
          t.vy += DROP_GRAVITY * dt
          t.y += t.vy * dt
          t.x += t.vx * dt
          t.rot += t.vrot * dt * 2
        }
        tomatoes = tomatoes.filter((t) => t.y < h + t.size * 2)
        tomatoesRef.current = tomatoes
        if (tomatoes.length === 0) droppingRef.current = false
      } else if (runningRef.current) {
        // Идёт отсчёт — появляются новые и плавно падают
        if (!reducedMotion) {
          spawnAccRef.current += dt
          while (spawnAccRef.current >= SPAWN_INTERVAL) {
            spawnAccRef.current -= SPAWN_INTERVAL
            if (tomatoes.length < MAX_TOMATOES) tomatoes.push(createTomato(w))
          }
        }
        for (const t of tomatoes) {
          t.y += t.vy * dt
          t.x += t.vx * dt
          t.rot += t.vrot * dt
        }
        tomatoesRef.current = tomatoes.filter((t) => t.y < h + t.size)
      }
      // На паузе позиции не меняем — просто перерисовываем текущий кадр

      ctx.clearRect(0, 0, w, h)
      for (const t of tomatoesRef.current) {
        ctx.save()
        ctx.translate(t.x, t.y)
        ctx.rotate(t.rot)
        ctx.font = `${t.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('🍅', 0, 0)
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      lastTimeRef.current = 0
    }
  }, [])

  return <canvas ref={canvasRef} className="tomato-rain" aria-hidden="true" />
}
