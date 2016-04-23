# 非同期処理あれこれ

niigata.js #1

## なにかと問題となるトピックス

* コールバック地獄
* 正常時の処理と例外処理の分離（別文脈に分けることができるか）
* 並列処理。それぞれの処理完了の待ち合わせをどう実現するか
* 逐次処理。処理が終わるまで次の処理をブロッキングできるか


## ケーススタディ

### 任意の集団に対する複数問のアンケート

* 複数の設問がリストアップされている
* アンケート実施者は設問をリストから１つを回答者全員に提示する
* 回答者は設問に対し、yes/no で回答する（true/falseで回答する）
* 回答者は回答の判断に時間を要し、その時間は回答者によってバラバラである
* 実施者は回答が出揃うまで次の設問を提示しない
* 実施者は回答が出揃ったら、回答を集計し、その結果を提示する。
* 実施者は結果を提示したのち、次の設問の提示する
* ただし、次の設問がない場合は終了を宣言して終了する
* まれに、回答者が回答不能を起こす場合がある
* 回答不能の場合、回答不能の報告を行う
* 回答不能の場合、アンケート結果に反映しない

```js
module.exports = Respondent

function Respondent (name) {
    if (!(this instanceof Respondent)) return new Respondent(name)
        this.name = name
 }

Respondent.prototype.answer = function (question, done) {
    setTimeout(function () {
        var n = rand()
        if (n === 0)
            done(error(question, this.name))

        else
            done(null, {
                question: question
              , name: this.name
              , answer: !!(n % 2)
            })
    }.bind(this), rand())
}

function error (question, name) {
    return new Error('i can not answer to it '
                   + ' [question: ' + question
                   + ' , name: ' + name + ']')
}

function rand () {
    return parseInt(Math.random() * 10, 10)
}
```

```js
'use strict'
var classRoom = require('./lib/class-room')()
var questions = require('./questions').questions

takeQuestion(questions.shift())

function takeQuestion (question) {
    var answers = []
    var c       = 0
    classRoom.forEach(function (respondent) {
        respondent.answer(question, function (err, answer) {
            if (err) onError(err)
            else answers.push(answer)

            if ((c += 1) === classRoom.length) next(answers)
        })
    })
}

function next (answers) {
    console.dir(reduce(answers))

    if (questions.length) takeQuestion(questions.shift())
    else console.log('complete')
}

function reduce (answers) {
    return answers.reduce(function (hash, answer) {
        answer.answer ? (hash.yes += 1) : (hash.no += 1)
        return hash
    }, {question: answers[0].question, yes: 0, no: 0})
}

function onError (err) {
    console.error(err)
}
```
