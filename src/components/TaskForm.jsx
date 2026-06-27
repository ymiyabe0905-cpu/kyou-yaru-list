// ============================================================
// 提出物の「追加 / 編集」フォーム（画面の上にかぶせて出すモーダル）
// 登録項目: 教科 / 提出物名 / 提出期限 / 作業量 / メモ / 状態
// ============================================================
import { useState } from 'react'
import { SUBJECTS, ESTIMATES, STATUS, STATUS_ORDER } from '../constants.js'
import { todayStr } from '../utils/date.js'

export default function TaskForm({ initial, onSave, onClose }) {
  const isEdit = Boolean(initial) // 編集なら initial が入っている

  // 入力欄の初期値（編集ならその値、新規なら空＋今日の日付）
  const [subject, setSubject] = useState(initial?.subject ?? SUBJECTS[0])
  const [title, setTitle] = useState(initial?.title ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? todayStr())
  const [estimatedTime, setEstimatedTime] = useState(
    initial?.estimatedTime ?? 15,
  )
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'mada')
  // 「その他」を選んだときに打ち込む教科名（例: 家庭科）
  const [customSubject, setCustomSubject] = useState(initial?.customSubject ?? '')

  const isOther = subject === 'その他'

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      alert('提出物名を入れてね')
      return
    }
    if (isOther && !customSubject.trim()) {
      alert('教科の名前を入れてね（例: 家庭科）')
      return
    }
    onSave({
      subject,
      // その他のときだけ教科名を保存。それ以外は空にしておく
      customSubject: isOther ? customSubject.trim() : '',
      title: title.trim(),
      dueDate,
      estimatedTime,
      memo,
      status,
    })
  }

  return (
    // 背景の暗い部分。タップで閉じる。
    <div className="modal-backdrop" onClick={onClose}>
      {/* カード本体（中のクリックでは閉じないように stopPropagation） */}
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="modal-title">{isEdit ? '✏ 直す' : '＋ 追加'}</h2>

        {/* 教科 */}
        <label className="field">
          <span>教科</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* 「その他」を選んだときだけ、教科名を打ち込む欄を出す */}
        {isOther && (
          <label className="field">
            <span>教科の名前</span>
            <input
              type="text"
              value={customSubject}
              placeholder="例: 家庭科 / 美術 / 技術 / 音楽"
              onChange={(e) => setCustomSubject(e.target.value)}
            />
          </label>
        )}

        {/* 提出物名 */}
        <label className="field">
          <span>提出物名</span>
          <input
            type="text"
            value={title}
            placeholder="例: 漢字ワーク p.20"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </label>

        {/* 提出期限 */}
        <label className="field">
          <span>提出期限</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        {/* 作業量（ボタンで選ぶ＝タップしやすい） */}
        <div className="field">
          <span>作業量</span>
          <div className="choice-row">
            {ESTIMATES.map((e) => (
              <button
                type="button"
                key={e.value}
                className={`choice ${estimatedTime === e.value ? 'on' : ''}`}
                onClick={() => setEstimatedTime(e.value)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* 状態（ボタンで選ぶ） */}
        <div className="field">
          <span>いまの状態</span>
          <div className="choice-row">
            {STATUS_ORDER.map((key) => (
              <button
                type="button"
                key={key}
                className={`choice ${status === key ? 'on' : ''}`}
                onClick={() => setStatus(key)}
              >
                {STATUS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* メモ */}
        <label className="field">
          <span>メモ（なくてもOK）</span>
          <textarea
            value={memo}
            rows={2}
            placeholder="例: ノート見ながらやる"
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>

        {/* 保存・キャンセル */}
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            やめる
          </button>
          <button type="submit" className="btn-save">
            {isEdit ? '保存する' : '追加する'}
          </button>
        </div>
      </form>
    </div>
  )
}
