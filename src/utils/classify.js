// ============================================================
// 提出物を「自動で分類」「危険度を判定」「今日やることを選ぶ」ロジック
// 画面(見た目)とは切り離してあるので、ルール変更はここだけ直せばよい
// ============================================================
import { daysUntil } from './date.js'
import { TODAY_MAX } from '../constants.js'

// --- 危険度の判定 ---------------------------------------------
// 期限を過ぎている  → overdue（期限切れ）
// 今日が期限        → today（今日まで）
// 明日が期限        → tomorrow（危険）
// 3日以内           → soon（注意）
// それ以外          → normal（通常）
export function getDanger(task) {
  const d = daysUntil(task.dueDate)
  if (d < 0) return 'overdue'
  if (d === 0) return 'today'
  if (d === 1) return 'tomorrow'
  if (d <= 3) return 'soon'
  return 'normal'
}

// --- カテゴリ（トップ画面のどの枠に入れるか）の判定 -------------
//  kanryo   … 完了（出した）
//  dasudake … 学校で出すだけ（終わった けど まだ出していない）
//  okure    … 遅れ（期限が過ぎていて まだ出していない）
//  kyou     … 今日やる（今日が期限）
//  ashita   … 明日まで
//  konshu   … 今週中（7日以内）
//  yoyu     … 余裕あり（それ以外）
export function getCategory(task) {
  if (task.status === 'dashita') return 'kanryo'
  if (task.status === 'owatta') return 'dasudake'

  const d = daysUntil(task.dueDate)
  if (d < 0) return 'okure'
  if (d === 0) return 'kyou'
  if (d === 1) return 'ashita'
  if (d <= 7) return 'konshu'
  return 'yoyu'
}

// --- 「今日やること」リストを作る -----------------------------
// 対象: まだ手をつけていない / やってる途中 の課題（＝作業が必要なもの）
// 並び順:
//   1. 期限切れ
//   2. 今日まで
//   3. 明日まで
//   （ここまでが緊急グループ。グループ内では↓の順）
//   4. 作業量が少ない順（5分など、すぐ終わるものを先に＝達成感）
//   5. 期限が近い順
// 最大 TODAY_MAX(5) 件まで。
export function getTodayTasks(tasks) {
  // 作業が必要な状態だけに絞る（終わった・出した は除く）
  const actionable = tasks.filter(
    (t) => t.status === 'mada' || t.status === 'yatteru',
  )

  // 緊急度のグループ番号（小さいほど先）
  const urgencyGroup = (t) => {
    const d = daysUntil(t.dueDate)
    if (d < 0) return 0 // 期限切れ
    if (d === 0) return 1 // 今日まで
    if (d === 1) return 2 // 明日まで
    return 3 // それ以外（あれば下の方）
  }

  const sorted = [...actionable].sort((a, b) => {
    // (1)(2)(3) 緊急グループ順
    const ga = urgencyGroup(a)
    const gb = urgencyGroup(b)
    if (ga !== gb) return ga - gb
    // (4) 作業量が少ない順
    if (a.estimatedTime !== b.estimatedTime) {
      return a.estimatedTime - b.estimatedTime
    }
    // (5) 期限が近い順
    return daysUntil(a.dueDate) - daysUntil(b.dueDate)
  })

  return sorted.slice(0, TODAY_MAX)
}
