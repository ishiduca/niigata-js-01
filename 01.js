'use strict'
var debug     = require('debug')('error')
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
    debug(err)
    //console.error(err)
}
