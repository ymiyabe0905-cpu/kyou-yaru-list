// ============================================================
// ブラウザのローカルストレージへの保存・読み込み
// （ブラウザを閉じてもデータが消えないようにする）
//
// 将来 Google スプレッドシートや Firebase に差し替えるときは、
// この load / save の中身を書き換えるだけで済むようにしてある。
// ============================================================

const STORAGE_KEY = 'kyou-yaru-list:tasks'
const SEEDED_KEY = 'kyou-yaru-list:seeded' // 初期データを入れ終わった印

// 保存されている提出物の一覧を読み込む（無ければ空配列）
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (e) {
    // データが壊れていても落ちないように、空で返す
    console.warn('データの読み込みに失敗しました', e)
    return []
  }
}

// 提出物の一覧をまるごと保存する
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.warn('データの保存に失敗しました', e)
  }
}

// 初期データ（夏休み課題）をもう入れたか？
// 一度でも入れたら true。これで、課題を全部消しても勝手に復活しないようにする。
export function isSeeded() {
  return localStorage.getItem(SEEDED_KEY) === '1'
}

// 初期データを入れた印をつける
export function markSeeded() {
  try {
    localStorage.setItem(SEEDED_KEY, '1')
  } catch (e) {
    console.warn('初期化フラグの保存に失敗しました', e)
  }
}
