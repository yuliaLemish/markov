module.exports = {
    execute: function(rules, inputString, callback) {
        var result = '&' + inputString,
        i,
        error = null,
        debug = [],
        debugObj;

        try {
            for (i = 0; i < rules.length; i++) {
                result = '&' + result.replace(/&/g, "");
                if (result.indexOf(rules[i].in) == -1) {
                    continue;
                } else {
                    debugObj = {rule: '', in: '', out: ''};
                    debugObj.rule = i;
                    debugObj.in = result;
                    result = result.replace(rules[i].in, rules[i].out);
                    debugObj.out = result;
                    debug.push(debugObj);
                    if (rules[i].last == "on") break;
                    i = -1;
                }
            }
            result = result.replace(/&/g, '');
        } catch (err) {
            error = err;
        }
        callback(error, result, debug);
    }
}
