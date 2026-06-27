// ============================================================
// アプリ本体。各パーツを組み立てて、トップ画面を作る。
// 画面の順番（仕様どおり）:
//   1. 今日やること（一番大きく目立つ）
//   2. 学校で出すだけ
//   3. 遅れ
//   4. 今日やる（※今日が期限のもの。5件に入りきらない分もここで見える）
//   5. 明日まで
//   6. 今週中
//   7. 余裕あり
//   8. 完了（最初は折りたたみ）
// ============================================================
import { useMemo, useState } from 'react'
import { useTasks } from './hooks/useTasks.js'
import { getCategory, getTodayTasks } from './utils/classify.js'
import { daysUntil } from './utils/date.js'

import TodayList from './components/TodayList.jsx'
import ReadyToSubmit from './components/ReadyToSubmit.jsx'
import TaskSection from './components/TaskSection.jsx'
import TaskForm from './components/TaskForm.jsx'
import Toolbar from './components/Toolbar.jsx'
import ParentSummary from './components/ParentSummary.jsx'

export default function App() {
  const {
    tasks,
    addTask,
    updateTask,
    removeTask,
    advanceStatus,
    revertStatus,
  } = useTasks()

  // フォーム（追加/編集）の開閉。editing に中身が入っていれば編集モード。
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // 並び替え・絞り込み
  const [sort, setSort] = useState('due') // due=期限順 / time=作業量順
  const [filterSubject, setFilterSubject] = useState('all')

  // 「出した」になった直後のカードID（光る演出に使う）
  const [justClearedId, setJustClearedId] = useState(null)

  // --- 並び替え・絞り込みを適用した一覧を作る -------------------
  const visibleTasks = useMemo(() => {
    let list = [...tasks]
    // 教科の絞り込み
    if (filterSubject !== 'all') {
      list = list.filter((t) => t.subject === filterSubject)
    }
    // 並び替え
    list.sort((a, b) => {
      if (sort === 'time') return a.estimatedTime - b.estimatedTime
      return daysUntil(a.dueDate) - daysUntil(b.dueDate) // 期限が近い順
    })
    return list
  }, [tasks, sort, filterSubject])

  // --- カテゴリごとに振り分け ---------------------------------
  const grouped = useMemo(() => {
    const g = {
      okure: [], kyou: [], ashita: [], konshu: [], yoyu: [],
      dasudake: [], kanryo: [],
    }
    for (const t of visibleTasks) {
      g[getCategory(t)].push(t)
    }
    return g
  }, [visibleTasks])

  // 今日やること（絞り込みは無視して、本当の全データから選ぶ）
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks])

  // 親の確認用まとめの件数（絞り込み無視＝全体を見る）
  const counts = useMemo(() => {
    const c = { okure: 0, kyou: 0, ashita: 0, dasudake: 0, kanryo: 0 }
    for (const t of tasks) {
      const cat = getCategory(t)
      if (cat in c) c[cat] += 1
    }
    return c
  }, [tasks])

  // --- 状態を進める。出した時だけ「クリア！」演出を出す --------
  function handleAdvance(id) {
    const target = tasks.find((t) => t.id === id)
    const willBeDashita = target && target.status === 'owatta'
    advanceStatus(id)
    if (willBeDashita) {
      setJustClearedId(id)
      // 1.2秒後に演出を消す（重くならないよう短く）
      setTimeout(() => setJustClearedId(null), 1200)
    }
  }

  // カードへ渡す操作をひとまとめに
  const cardHandlers = {
    justClearedId,
    onAdvance: handleAdvance,
    onRevert: revertStatus,
    onEdit: (task) => {
      setEditing(task)
      setFormOpen(true)
    },
    onRemove: (id) => {
      if (confirm('この提出物を消す？')) removeTask(id)
    },
  }

  // フォームの保存（新規 or 編集）
  function handleSave(data) {
    if (editing) updateTask(editing.id, data)
    else addTask(data)
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="app-header">
        <h1 className="app-logo">
          <img src="/favicon.svg" alt="" className="logo-icon" />
          今日やるリスト
        </h1>
        <ParentSummary counts={counts} />
      </header>

      <main className="app-main">
        {/* 1. 今日やること（最重要・最大） */}
        <TodayList tasks={todayTasks} cardHandlers={cardHandlers} />

        {/* 2. 学校で出すだけ */}
        <ReadyToSubmit tasks={grouped.dasudake} cardHandlers={cardHandlers} />

        {/* 並び替え・絞り込み */}
        <Toolbar
          sort={sort}
          setSort={setSort}
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
        />

        {/* 3〜8. 各カテゴリの枠 */}
        <TaskSection title="遅れ" emoji="🔥" accent="okure"
          tasks={grouped.okure} cardHandlers={cardHandlers} />
        <TaskSection title="今日やる" emoji="⛏" accent="kyou"
          tasks={grouped.kyou} cardHandlers={cardHandlers} />
        <TaskSection title="明日まで" emoji="⚠" accent="ashita"
          tasks={grouped.ashita} cardHandlers={cardHandlers} />
        <TaskSection title="今週中" emoji="📌" accent="konshu"
          tasks={grouped.konshu} cardHandlers={cardHandlers} />
        <TaskSection title="余裕あり" emoji="🌱" accent="yoyu"
          tasks={grouped.yoyu} cardHandlers={cardHandlers} />
        <TaskSection title="完了" emoji="💎" accent="kanryo"
          tasks={grouped.kanryo} cardHandlers={cardHandlers}
          defaultOpen={false} />

        {/* 何も登録がないときの案内 */}
        {tasks.length === 0 && (
          <p className="hint">
            まだ提出物がないよ。下の「＋ 追加」から登録しよう！
          </p>
        )}
      </main>

      {/* 追加ボタン（画面下に固定。スマホで押しやすい大きさ） */}
      <button
        className="fab"
        onClick={() => {
          setEditing(null)
          setFormOpen(true)
        }}
      >
        ＋ 追加
      </button>

      {/* 追加/編集フォーム */}
      {formOpen && (
        <TaskForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
