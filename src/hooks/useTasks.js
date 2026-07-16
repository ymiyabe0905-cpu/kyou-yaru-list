// ============================================================
// 提出物データの「state（状態）」と「操作」をまとめた自作フック
// 追加 / 編集 / 削除 / 状態変更 / コピー などはすべてここを通す。
// 変更があるたびに自動でローカルストレージへ保存する。
// ============================================================
import { useEffect, useState } from 'react'
import { loadTasks, saveTasks, isSeeded, markSeeded } from '../utils/storage.js'
import { STATUS_ORDER } from '../constants.js'
import { addDays } from '../utils/date.js'
import { seedTasks } from '../seedTasks.js'

// ユニークなIDを作る（時刻＋ランダム。1人用なので十分）
function newId() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function useTasks() {
  // 最初の表示時にローカルストレージから読み込む。
  // まだ何も入っておらず、初期データも入れていない「初回だけ」、
  // 2年生の夏休み課題を自動で入れる。
  const [tasks, setTasks] = useState(() => {
    const loaded = loadTasks()
    if (loaded.length === 0 && !isSeeded()) {
      markSeeded()
      return seedTasks
    }
    return loaded
  })

  // tasks が変わるたびに保存（ブラウザを閉じても消えない）
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // --- 追加 ---------------------------------------------------
  function addTask(input) {
    const now = new Date().toISOString()
    const task = {
      id: newId(),
      subject: input.subject,
      customSubject: input.customSubject || '', // 「その他」のときの教科名
      title: input.title,
      dueDate: input.dueDate, // 'YYYY-MM-DD'
      estimatedTime: input.estimatedTime, // 分（5/15/30/60）
      memo: input.memo || '',
      status: input.status || 'mada',
      createdAt: now,
      updatedAt: now,
    }
    setTasks((prev) => [...prev, task])
  }

  // --- 編集 ---------------------------------------------------
  function updateTask(id, changes) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date().toISOString() }
          : t,
      ),
    )
  }

  // --- 削除 ---------------------------------------------------
  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // --- 状態をワンタップで進める（まだ→やってる→終わった→出した）---
  function advanceStatus(id) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const i = STATUS_ORDER.indexOf(t.status)
        const next = STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]
        return { ...t, status: next, updatedAt: new Date().toISOString() }
      }),
    )
  }

  // --- 状態を1つ戻す（押し間違えたとき用）----------------------
  function revertStatus(id) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const i = STATUS_ORDER.indexOf(t.status)
        const back = STATUS_ORDER[Math.max(i - 1, 0)]
        return { ...t, status: back, updatedAt: new Date().toISOString() }
      }),
    )
  }

  // --- コピー（同じ内容をもう1つ作る。状態は「まだ」に戻す）------
  function duplicateTask(id) {
    setTasks((prev) => {
      const src = prev.find((t) => t.id === id)
      if (!src) return prev
      const now = new Date().toISOString()
      const copy = {
        ...src,
        id: newId(),
        status: 'mada',
        createdAt: now,
        updatedAt: now,
      }
      return [...prev, copy]
    })
  }

  // --- 毎週出る課題を「次の週の分」として作る（期限を+7日）------
  function duplicateNextWeek(id) {
    setTasks((prev) => {
      const src = prev.find((t) => t.id === id)
      if (!src) return prev
      const now = new Date().toISOString()
      const copy = {
        ...src,
        id: newId(),
        dueDate: addDays(src.dueDate, 7), // 1週間後にずらす
        status: 'mada',
        createdAt: now,
        updatedAt: now,
      }
      return [...prev, copy]
    })
  }

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    advanceStatus,
    revertStatus,
    duplicateTask,
    duplicateNextWeek,
  }
}
