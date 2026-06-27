// ============================================================
// アプリ全体で使う「決まった値」をまとめたファイル
// 教科を増やしたり、状態の文言を変えたいときはここを直すだけでOK
// ============================================================

// 対象教科（登録フォームのプルダウンに出る順番）
// ※「その他」は家庭科・美術・技術・音楽など、普段は出ない課題用の受け皿。
//   どの教科か分かるように、提出物名に書いておくと見やすい（例:「家庭科 エプロン」）
export const SUBJECTS = [
  '英語1',
  '英語2',
  '代数',
  '計算',
  '幾何',
  '理科',
  '国語',
  '社会',
  '漢字',
  'その他',
]

// 状態（4段階）。
// key … 内部で使う値（データに保存される）
// label … 画面に出すやさしい言葉
// next … ワンタップで進めたとき次に進む状態
export const STATUS = {
  mada:    { key: 'mada',    label: 'まだ',    next: 'yatteru', blockName: '土' },
  yatteru: { key: 'yatteru', label: 'やってる', next: 'owatta',  blockName: '石' },
  owatta:  { key: 'owatta',  label: '終わった', next: 'dashita', blockName: '鉄' },
  dashita: { key: 'dashita', label: '出した',  next: null,      blockName: 'エメラルド' },
}

// 状態の進む順番（戻すボタンで前に戻るときにも使う）
export const STATUS_ORDER = ['mada', 'yatteru', 'owatta', 'dashita']

// 作業量（4段階）。value は「分」。並び替えに使うので数値にしてある。
export const ESTIMATES = [
  { value: 5,  label: '5分' },
  { value: 15, label: '15分' },
  { value: 30, label: '30分' },
  { value: 60, label: '1時間以上' },
]

// 作業量の数値から表示ラベルを引く便利関数
export function estimateLabel(value) {
  const found = ESTIMATES.find((e) => e.value === value)
  return found ? found.label : `${value}分`
}

// 危険度（期限からの自動判定）。色分けの基準にもなる。
export const DANGER = {
  overdue:  { key: 'overdue',  label: '期限切れ' },
  today:    { key: 'today',    label: '今日まで' },
  tomorrow: { key: 'tomorrow', label: '危険' },
  soon:     { key: 'soon',     label: '注意' },
  normal:   { key: 'normal',   label: '通常' },
}

// 今日やることリストに出す最大件数（多すぎるとやる気が出ないので5件まで）
export const TODAY_MAX = 5
