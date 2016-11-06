
// https://github.com/pkolt/express-nunjucks/blob/master/README.md
//https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc#.9l7l0oi2t
const express = require('express');


const expressNunjucks = require('express-nunjucks');
const app = express();
const isDev = app.get('env') === 'development';

app.set('views', __dirname + '/src/templates');

const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

//console.log(njk.env ) nunjucks environoment
// db connection

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/prototype', function (err, db) {
    if (err) throw err;

    db.collection('heroes').find().toArray(function (err, result) {
        if (err) throw err;

        console.log(result)
    })
});

// add pages here
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/contact', (req, res) => {
    var data = {
        firstName: 'Simon',
        lastName: 'LeBon'
    };
    //simple data render example
    res.render('pages/contact', { data } );
    //http://expressjs.com/en/api.html#res.render
});


// end add pages

app.listen(3000);
