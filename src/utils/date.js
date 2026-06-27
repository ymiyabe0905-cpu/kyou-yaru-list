// ============================================================
// 日付まわりの便利関数
// 「今日」を基準に、提出期限まであと何日かを計算する
// ※ 時差(タイムゾーン)でズレないよう、年月日だけで計算している
// ============================================================

// 今日の日付を YYYY-MM-DD の文字列で返す（input[type=date] と同じ形）
export function todayStr() {
  const d = new Date()
  return toDateStr(d)
}

// Date オブジェクト → 'YYYY-MM-DD' に変換
export function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 'YYYY-MM-DD' を、その日の 0時のDateにして返す
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 提出期限まで「あと何日か」を返す
//   0  … 今日が期限
//   1  … 明日が期限
//   -1 … 昨日が期限（＝1日遅れ）
export function daysUntil(dueDate) {
  if (!dueDate) return 9999 // 期限なしは「ずっと先」とみなす
  const today = parseDate(todayStr())
  const due = parseDate(dueDate)
  const ms = due.getTime() - today.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

// 期限を「今日 / 明日 / ○日後 / ○日遅れ」など、やさしい言葉にする
export function dueText(dueDate) {
  if (!dueDate) return '期限なし'
  const d = daysUntil(dueDate)
  if (d < 0) return `${Math.abs(d)}日 遅れ`
  if (d === 0) return '今日まで'
  if (d === 1) return '明日まで'
  return `あと${d}日`
}

// 期限を「6/27(土)」のような見やすい表示にする
export function dueLabel(dueDate) {
  if (!dueDate) return '—'
  const due = parseDate(dueDate)
  const week = ['日', '月', '火', '水', '木', '金', '土'][due.getDay()]
  return `${due.getMonth() + 1}/${due.getDate()}(${week})`
}

// 日付を「○日後」にずらした文字列を返す（毎週分のコピーで使う）
export function addDays(dateStr, n) {
  const d = parseDate(dateStr || todayStr())
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}
