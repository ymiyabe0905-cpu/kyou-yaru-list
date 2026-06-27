// ============================================================
// 「学校で出すだけ」枠
// 課題は終わったのに、まだ学校に出していないもの。
// 中学生は出し忘れがちなので、かなり目立たせる。
// （ただし画面がうるさくなりすぎないよう、件数0なら出さない）
// ============================================================
import TaskCard from './TaskCard.jsx'

export default function ReadyToSubmit({ tasks, cardHandlers }) {
  if (tasks.length === 0) return null

  return (
    <section className="ready-block">
      <div className="ready-head">
        <h2 className="ready-title">🎒 あとは学校で出すだけ</h2>
        <p className="ready-sub">カバンに入れた？ 先生に出したら「出した」を押す</p>
      </div>

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
    </section>
  )
}
