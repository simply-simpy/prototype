
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
//var env = new nunjucks.Environment(AsyncLoaderFromDatabase, opts);

//console.log(njk.env ) nunjucks environoment
// db connection

// browsersync
if (app.get('env') == 'development') {
    var browserSync = require('browser-sync');
    var bs = browserSync({
        logSnippet: false,
        files: ["**/css/main.css", "**/js/**/*.js"]
    });
    app.use(require('connect-browser-sync')(bs));
}

// add pages here
app.get('/', (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/prototype', function (err, db) {
        if (err) throw err;
        db.collection('heroes').find().toArray(function (err, result) {
            if (err) throw err;
            res.render('pages/index', { result } );
        })
    });
});

app.get('/contact', (req, res) => {
    var data = {
        firstName: 'Simon',
        lastName: 'LeBon'
    };
    // simple data render example
    res.render('pages/contact', {data});
    //http://expressjs.com/en/api.html#res.render
});

// makes static files available
app.use(express.static('public'));

// end add pages

app.listen(8080);
