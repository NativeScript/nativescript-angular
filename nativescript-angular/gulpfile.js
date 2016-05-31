var gulp = require('gulp');
var del = require('del');
var glob = require('glob');

gulp.task('clean-defs', function() {
    var files = [...glob.sync("*.ts"), ...glob.sync("!(node_modules)/*.ts")]
        .map(function(file) {
            return file.replace(/.ts$/, '.d.ts');
        });
    
    return del(files).then(paths => {
        console.log('Definition files cleaned:')
        console.log(paths.join('\n'));
    });   
});