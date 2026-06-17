import { useState, useEffect } from 'react'

const getToday = () => {
  const today = new Date()
  const offset = today.getTimezoneOffset() * 60000
  return (new Date(today - offset)).toISOString().split('T')[0]
}

const getDaysInCurrentMonth = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
}

const defaultHabits = [
  { id: 'fajr', name: 'Fajr', history: [] },
  { id: 'dhuhr', name: 'Dhuhr', history: [] }, 
  { id: 'asr', name: 'Asr', history: [] },
  { id: 'maghreeb', name: 'Maghreeb', history: [] },
  { id: 'isha', name: 'Isha', history: [] },
  { id: 'workout', name: 'Workout', history: [] },
]

export default function App() {
  const todayDate = getToday()
  const currentMonthPrefix = todayDate.substring(0, 7) 
  const daysInMonth = getDaysInCurrentMonth()

  // MENGGUNAKAN V3 AGAR MEMULAI DATABASE BARU YANG BERSIH
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habitTrackerDataV3')
    if (savedHabits) return JSON.parse(savedHabits)
    return defaultHabits
  })

  useEffect(() => {
    localStorage.setItem('habitTrackerDataV3', JSON.stringify(habits))
  }, [habits])

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const hasDoneToday = habit.history.includes(todayDate)
        const newHistory = hasDoneToday 
          ? habit.history.filter(date => date !== todayDate) 
          : [...habit.history, todayDate]
        return { ...habit, history: newHistory }
      }
      return habit
    }))
  }

  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => habit.history.includes(todayDate)).length;
  const progressPercentage = Math.round((completedToday / totalHabits) * 100) || 0;

  const getCompletionsThisMonth = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return 0;
    return habit.history.filter(d => d.startsWith(currentMonthPrefix)).length;
  }

  const DonutChart = ({ id, label }) => {
    const completed = getCompletionsThisMonth(id);
    const percentage = (completed / daysInMonth) * 100;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontFamily: 'Arial, sans-serif', marginBottom: '6px', fontWeight: '500' }}>{label}</span>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: `conic-gradient(#4d4d4d ${percentage}%, #d9d9d9 ${percentage}%)`,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#fff', borderRadius: '50%' }} />
        </div>
      </div>
    )
  }

  const WorkoutBarChart = () => {
    const completed = getCompletionsThisMonth('workout');
    const remaining = daysInMonth - completed;
    const completedPercent = (completed / daysInMonth) * 100;
    const remainingPercent = 100 - completedPercent;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', marginBottom: '10px', fontWeight: '500' }}>Workout</span>
        <div style={{ display: 'flex', height: '220px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginRight: '10px', fontSize: '12px', color: '#000', paddingBottom: '10px' }}>
            <span>30</span><span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
          </div>
          <div style={{ width: '55px', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ height: `${remainingPercent}%`, backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {remaining > 0 && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{remaining}</span>}
            </div>
            <div style={{ height: `${completedPercent}%`, backgroundColor: '#4d4d4d', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
              {completed > 0 && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{completed}</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background-color: #ffffff; color: #000; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .header-text { font-family: 'Georgia', 'Times New Roman', serif; margin: 0; line-height: 0.85; letter-spacing: -1.5px; }
        .grid-checkbox { appearance: none; -webkit-appearance: none; width: 24px; height: 24px; border: 2px solid #000; background-color: transparent; cursor: pointer; position: relative; flex-shrink: 0; margin-right: 12px; }
        .grid-checkbox:checked::after { content: '✔'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 18px; color: #000; }
        .grid-label { display: flex; alignItems: center; cursor: pointer; font-size: 16px; font-weight: 400; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h1 className="header-text" style={{ fontSize: '32px', fontWeight: '900' }}>HABIT</h1>
            <h1 className="header-text" style={{ fontSize: '32px', fontWeight: '900' }}>TRACKER</h1>
            <h2 className="header-text" style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', letterSpacing: '-0.5px' }}>
              by phileory
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ width: '35%' }}>
              <WorkoutBarChart />
            </div>
            <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div><DonutChart id="fajr" label="Fajr" /></div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <DonutChart id="dhuhr" label="Dhuhr" />
                <DonutChart id="asr" label="Asr" />
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <DonutChart id="maghreeb" label="Maghreeb" />
                <DonutChart id="isha" label="Isha" />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '3px', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
              <span>DAILY PROGRESS</span>
              <span>{progressPercentage} %</span>
            </div>
            <div style={{ width: '100%', height: '2px', backgroundColor: '#000', marginBottom: '24px' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='fajr').history.includes(todayDate)} onChange={() => toggleHabit('fajr')} /> Fajr
                </label>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='dhuhr').history.includes(todayDate)} onChange={() => toggleHabit('dhuhr')} /> Dhuhr
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='asr').history.includes(todayDate)} onChange={() => toggleHabit('asr')} /> Asr
                </label>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='maghreeb').history.includes(todayDate)} onChange={() => toggleHabit('maghreeb')} /> Maghreeb
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='isha').history.includes(todayDate)} onChange={() => toggleHabit('isha')} /> Isha
                </label>
                <label className="grid-label">
                  <input type="checkbox" className="grid-checkbox" checked={habits.find(h=>h.id==='workout').history.includes(todayDate)} onChange={() => toggleHabit('workout')} /> Workout
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}