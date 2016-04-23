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
