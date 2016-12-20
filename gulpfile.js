const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
var data = require('gulp-data');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var gutil = require('gulp-util');
const logger = require('gulp-logger');
var nunjucksRender = require('gulp-nunjucks-render');
var through = require('through2');




// gulp.task('db-test', function() {
//
//
//     return gulp.src('src/templates/**/*.html')
//
//         .pipe(data(function(file, cb) {
//             MongoClient.connect('mongodb://localhost:27017/prototype', function (err, db) {
//                 if(err) return cb(err);
//
//                // cb(undefined, db.collection('heroes').findOne({filename: path.basename(file.path)}));
//                 cb(undefined, db.collection('heroes').find().toArray(function(result){
//                     return result;
//                     })
//                 );
//
//
//
//             });
//         }))
//         .pipe(nunjucks.compile( ))
//         .pipe(gulp.dest('dist'))
// });


gulp.task('db-test', function() {
    // return gulp.src('./examples/test3.html')
    return gulp.src('./src/templates/pages/**/*.+(html|nj)')
        .pipe(data(function(file, cb) {
            MongoClient.connect('mongodb://127.0.0.1:27017/prototype', function(err, db) {
                if(err) return cb(err);
                //cb(undefined, db.collection('heroes').findOne()); // <--This doesn't work.
                // db.collection('heroes').findOne(function(err, item) { <-- This does work.
                //     cb(undefined, item);
                // });
                db.collection('heroes').findOne(cb); // <-- This is shorthand
            });
        }))
        //.pipe(data({"title":"this works"})) -> This does work
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(through.obj(function(file,enc,cb){console.log('file.data:'+JSON.stringify(file.data,null,2))}))

});


// gulp.task('db-test', function() {
//     return gulp.src('./examples/test3.html')
//         .pipe(data(function(file, cb) {
//             MongoClient.connect('mongodb://127.0.0.1:27017/prototype', function(err, db) {
//                 if(err) return cb(err);
//                 cb(undefined, db.collection('heroes').findOne());
//             });
//         }))
//         .pipe(through.obj(function(file,enc,cb){console.log('file.data:'+JSON.stringify(file.data,null,2))}));
// });

//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications

gulp.task('nunjucks', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
        .pipe(data(function() {
            return require ('./src/js/variables/mq.json');
        }))
        .pipe(data(function() {
            return require('./src/data/data.json');
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());

});

gulp.task('default', () =>

    gulp.src('src/templates/**/*.html')
        .pipe(nunjucks.compile( ))
        .pipe(gulp.dest('dist'))

);