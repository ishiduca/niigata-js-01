var Respondent = require('./respondent')

module.exports = function (n) {
    var respondents = []
    for (var i = 0; i < (n || 20); i++) {
        respondents.push(new Respondent(String(i)))
    }
    return respondents
}
