// ============================================================
// 親が確認しやすい「確認用まとめ」（小さく表示）
// 期限切れ / 今日まで / 明日まで / 出すだけ / 出した の件数が一目で分かる。
// ============================================================
export default function ParentSummary({ counts }) {
  const items = [
    { label: '遅れ', value: counts.okure, cls: 'okure' },
    { label: '今日', value: counts.kyou, cls: 'kyou' },
    { label: '明日', value: counts.ashita, cls: 'ashita' },
    { label: '出すだけ', value: counts.dasudake, cls: 'dasudake' },
    { label: '出した', value: counts.kanryo, cls: 'kanryo' },
  ]

  return (
    <div className="summary">
      <span className="summary-label">かくにん</span>
      <div className="summary-items">
        {items.map((it) => (
          <div key={it.label} className={`summary-item s-${it.cls}`}>
            <b>{it.value}</b>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
