// ============================================================
// 折りたたみできる「枠（セクション）」
// 遅れ / 今日やる / 明日まで … などをこの枠で表示する。
// 完了の枠は最初から閉じておける（折りたたみ機能）。
// ============================================================
import { useState } from 'react'
import TaskCard from './TaskCard.jsx'

export default function TaskSection({
  title, // 枠の名前（例: 遅れ）
  emoji, // 見出しの絵文字
  tasks, // この枠に入る提出物
  accent, // 見出しの色クラス（例: okure）
  defaultOpen = true, // 最初から開いておくか
  cardHandlers, // カードのボタン操作（まとめて渡す）
}) {
  const [open, setOpen] = useState(defaultOpen)

  // 中身が0件の枠は、画面をうるさくしないため表示しない
  if (tasks.length === 0) return null

  return (
    <section className={`section accent-${accent}`}>
      {/* 見出しはタップで開閉できる */}
      <button className="section-head" onClick={() => setOpen((v) => !v)}>
        <span className="section-title">
          {emoji} {title}
        </span>
        <span className="section-count">{tasks.length}</span>
        <span className="section-toggle">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="card-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              justCleared={cardHandlers.justClearedId === task.id}
              onAdvance={cardHandlers.onAdvance}
              onRevert={cardHandlers.onRevert}
              onEdit={cardHandlers.onEdit}
              onRemove={cardHandlers.onRemove}
            />
          ))}
        </div>
      )}
    </section>
  )
}
