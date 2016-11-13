var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var algorithm = require('./algorithm.js');
var parser = require('./parser.js');
var formParser = require('./form-parser.js');


app.engine('pug', require('pug').__express);
app.use(express.static(__dirname + '/public'));

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var userRules = [{ in : "", out: "", last: "" }];
var rulesAmount = 1;

app.get('/', urlencodedParser, function(req, res) {
    res.render('index.pug', {
        pageTitle: "Markov",
        inputString: "",
        result: "",
        amount: rulesAmount,
        rules: userRules,
        debugArray: []
    });
});

app.post('/add', urlencodedParser, function(req, res) {
    userRules.push({ in : "", out: "", last: false });
    res.render('index.pug', {
        pageTitle: "Markov",
        inputString: "",
        result: "",
        amount: rulesAmount++,
        rules: userRules,
        debugArray: []
    }, function(err, html) {
        res.redirect('/');
    });
    res.end();

});

app.post('/del', urlencodedParser, function(req, res) {
    userRules.pop();
    res.render('index.pug', {
        pageTitle: "Markov",
        inputString: "",
        result: "",
        amount: rulesAmount--,
        rules: userRules,
        debugArray: []
    }, function(err, html) {
        res.redirect('/');
    });
    res.end();
});

app.post('/file', urlencodedParser, function(req, res) {
    parser(req.body.file, function(err, rules) {
        if (err) res.render('error.pug', { pageTitle: "error", error: err });
        userRules = rules;
        rulesAmount = rules.length;
        res.render('index.pug', {
                pageTitle: "markov",
                inputString: "",
                result: "",
                amount: rules.length,
                rules: rules,
                debugArray: []
            },
            function(err, html) {
                res.redirect('/');
            });
    });
});

app.post('/result', urlencodedParser, function(req, res) {
    algorithm.execute(req.body.rules, req.body.inputString, function(err, result, debugArr) {
        if (err) res.render('error.pug', { pageTitle: "error", error: err });
        console.log(debugArr);
        res.render('index.pug', {
            pageTitle: "Markov",
            inputString: req.body.inputString,
            result: result,
            amount: req.body.rules.length,
            rules: req.body.rules,
            debugArray: debugArr
        });
    });
    res.end();
});





app.listen(8080, function() {
    console.log('server is lidtening on port 8080');
});
