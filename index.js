const express = require('express');

const expressNunjucks = require('express-nunjucks');
const app = express();
const isDev = app.get('env') === 'development';

app.set('views', __dirname + '/src/templates');

const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

// add pages here
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
});
// end add pages

app.listen(3000);
