// ============================================================
// 並び替え・絞り込みのツールバー
//  - 並び替え: 期限が近い順 / 作業量が少ない順
//  - 絞り込み: 教科ごと
// ============================================================
import { SUBJECTS } from '../constants.js'

export default function Toolbar({ sort, setSort, filterSubject, setFilterSubject }) {
  return (
    <div className="toolbar">
      <label className="tool-field">
        <span>並び</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="due">期限が近い順</option>
          <option value="time">作業量が少ない順</option>
        </select>
      </label>

      <label className="tool-field">
        <span>教科</span>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="all">ぜんぶ</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
