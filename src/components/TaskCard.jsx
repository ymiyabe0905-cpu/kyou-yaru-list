// ============================================================
// 提出物カード（1件分のブロック風カード）
// デザインの意図:
//  - 状態でブロックの素材感を変える（土→石→鉄→エメラルド＝進むほど豪華）
//  - 危険度で枠の色を変える（赤＝やばい / 緑＝余裕）
//  - 状態を進めるボタンは大きく、戻すボタンは小さく
// ============================================================
import { STATUS, DANGER, estimateLabel } from '../constants.js'
import { getDanger } from '../utils/classify.js'
import { dueLabel, dueText } from '../utils/date.js'

export default function TaskCard({
  task,
  justCleared, // 「出した」になった直後だけ true（光る演出用）
  onAdvance,
  onRevert,
  onEdit,
  onRemove,
}) {
  const status = STATUS[task.status]
  const danger = getDanger(task)
  const nextStatus = status.next ? STATUS[status.next] : null

  // CSSクラスを組み立て（block-土 / danger-overdue など）
  const className = [
    'card',
    `block-${task.status}`, // 素材感（土/石/鉄/エメラルド）
    `danger-${danger}`, // 危険度の色
    justCleared ? 'just-cleared' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      {/* 「クリア！」の達成演出（出した直後だけ表示） */}
      {justCleared && <div className="clear-badge">クリア！</div>}

      {/* 上段: 教科バッジ＋危険度ラベル */}
      <div className="card-top">
        {/* 「その他」のときは打ち込んだ教科名を出す（例: 家庭科） */}
        <span className="subject-badge">{task.customSubject || task.subject}</span>
        {task.status !== 'dashita' && danger !== 'normal' && (
          <span className={`danger-badge danger-text-${danger}`}>
            {DANGER[danger].label}
          </span>
        )}
        <span className="status-badge">{status.label}</span>
      </div>

      {/* 提出物名（一番読みたい情報なので大きめ） */}
      <h3 className="card-title">{task.title}</h3>

      {/* 期限と作業量（標準フォントで見やすく） */}
      <div className="card-meta">
        <span className="meta-due">
          🗓 {dueLabel(task.dueDate)}・<b>{dueText(task.dueDate)}</b>
        </span>
        <span className="meta-time">⏱ {estimateLabel(task.estimatedTime)}</span>
      </div>

      {/* メモ（あるときだけ） */}
      {task.memo && <p className="card-memo">{task.memo}</p>}

      {/* メインの状態ボタン（ワンタップで次へ進む。大きく押しやすく） */}
      <div className="card-actions">
        {nextStatus ? (
          <button
            className="btn-advance"
            onClick={() => onAdvance(task.id)}
          >
            「{nextStatus.label}」にする ▶
          </button>
        ) : (
          <button className="btn-advance done" disabled>
            出した ✓
          </button>
        )}

        {/* 戻すボタン（押し間違え用なので小さく） */}
        {task.status !== 'mada' && (
          <button
            className="btn-revert"
            onClick={() => onRevert(task.id)}
            title="ひとつ戻す"
          >
            ↩ 戻す
          </button>
        )}
      </div>

      {/* その他の操作（編集・削除）は控えめに。
          ※「コピー」「来週分」は押し間違え防止のため外してある */}
      <div className="card-tools">
        <button onClick={() => onEdit(task)}>✏ 直す</button>
        <button className="tool-danger" onClick={() => onRemove(task.id)}>
          🗑 消す
        </button>
      </div>
    </div>
  )
}
