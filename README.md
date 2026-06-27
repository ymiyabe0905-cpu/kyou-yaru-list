# 今日やるリスト

中学生向けの提出物管理アプリ。「今日これだけやればいい」が一目で分かることを最優先にした、マインクラフト“雰囲気”UI。

## 使い方（はじめての人向け）

1. パソコンに [Node.js](https://nodejs.org/) を入れる（LTS版でOK）
2. このフォルダを開いて、以下を順番に実行する

```bash
npm install     # 最初の1回だけ。必要な部品をそろえる
npm run dev     # アプリを起動する
```

3. 画面に出た `http://localhost:5173/` をブラウザで開く
4. スマホで使いたいときは `npm run dev -- --host` で起動し、
   表示されたネットワークURL（同じWi-Fiのスマホからアクセス）を開く

データはブラウザに保存されます（閉じても消えません）。

## フォルダ構成

```
src/
  main.jsx            … アプリの入口
  App.jsx             … 画面の組み立て（トップ画面）
  constants.js        … 教科・状態・作業量などの定義
  hooks/
    useTasks.js       … データの追加/編集/削除/状態変更
  utils/
    date.js           … 日付の計算（あと何日か など）
    classify.js       … 自動分類・危険度・今日やること
    storage.js        … ローカル保存（将来Firebase等に差し替え可）
  components/
    TodayList.jsx     … 今日やること（最重要）
    ReadyToSubmit.jsx … 学校で出すだけ
    TaskSection.jsx   … 折りたためる枠
    TaskCard.jsx      … 提出物カード（ブロック風）
    TaskForm.jsx      … 追加/編集フォーム
    Toolbar.jsx       … 並び替え・絞り込み
    ParentSummary.jsx … 親の確認用まとめ
  styles/
    global.css        … 見た目（マイクラ風）
```
