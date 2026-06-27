// ============================================================
// 「今日やること」枠（このアプリで一番大事＝一番大きく目立たせる）
// アプリを開いたら、まずここだけ見れば動けるようにする。
// 最大5件まで。多すぎるとやる気が出ないため。
// ============================================================
import TaskCard from './TaskCard.jsx'

export default function TodayList({ tasks, cardHandlers }) {
  return (
    <section className="today-block">
      <div className="today-head">
        <h2 className="today-title">⛏ 今日やること</h2>
        <p className="today-sub">これだけやればOK！</p>
      </div>

      {tasks.length === 0 ? (
        // 何もないときは、不安にさせず「やったね」と伝える
        <div className="today-empty">
          🎉 いまやることは ないよ！<br />
          <span>あたらしい課題は下の「＋ 追加」から</span>
        </div>
      ) : (
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
