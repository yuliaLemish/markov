var fs = require('fs');

module.exports = function(dir, callback) {
    var rulesArray = [];
    var curObject = {};
    var error = null;
    var data = fs.readFileSync(dir, 'utf8', function(err, data) {
        if (err) error = "File should be in the app directory.";
    });
    try {
        data.split('\n')
            .forEach(function(line) {
                if (line) {
                    curObject = { in : "", out: "" };
                    if (line.indexOf('->.') != -1) {
                        values = line.split('->.');
                        curObject.last = "on";
                    } else {
                        values = line.split('->');
                    }
                    curObject.in = values[0].replace("\r", "").replace(/ +/g, "");
                    curObject.out = values[1].replace("\r", "").replace(/ +/g, "");
                    if ((curObject.in) && (curObject.out))
                        rulesArray.push(curObject);
                    else
                        error = 'Unacceptable file format.';
                }
            });
    } catch (err) {
        error = 'Unacceptable file format.';
    }
    callback(error, rulesArray);
}
