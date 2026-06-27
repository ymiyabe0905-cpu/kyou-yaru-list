// ============================================================
// ブラウザのローカルストレージへの保存・読み込み
// （ブラウザを閉じてもデータが消えないようにする）
//
// 将来 Google スプレッドシートや Firebase に差し替えるときは、
// この load / save の中身を書き換えるだけで済むようにしてある。
// ============================================================

const STORAGE_KEY = 'kyou-yaru-list:tasks'

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
