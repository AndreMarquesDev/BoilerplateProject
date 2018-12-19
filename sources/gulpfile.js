const { series, parallel, src, dest, watch, start, task } = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  browser = require('browser-sync'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  index = require('gulp-index'),
  jsObfuscator = require('gulp-javascript-obfuscator'),
  partials = require('gulp-inject-partials'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  wrap = require('gulp-wrap');
  fs = require('fs'),
  argv = require('yargs').argv;

// Builders
const buildModule = file => {
  return new Promise(resolve => {
    return src(file)
      .pipe(partials({ removeTags: true }))
      .pipe(wrap({ src: 'moduleTemplate.html' }))
      .pipe(rename({ dirname: '' }))
      .pipe(dest('../html'))
      .on('end', resolve)
      .pipe(browser.reload({ stream: true }))
    });
}

// const buildTemplate = () => {
//   return new Promise((resolve, reject) => {
//     return src('templates/*.html')
//       .pipe(partials({removeTags: true}))
//       .pipe(wrap({
//         src: 'layout.html'
//       }))
//       .pipe(rename({
//         dirname: ''
//       }))
//       .pipe(dest('../html/templates'))
//       .on('end', resolve)
//       .pipe(browser.reload({
//         stream: true
//       }));
//   });
// }

const buildCSS = () => {
  return src('scss/*.scss')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(autoprefixer({ gulpbrowsers: ['last 2 versions'] }))
    .pipe(dest('../css'))
    .pipe(browser.reload({ stream: true }));
};

const buildJS = file => {
  console.log(file);
  return src(file)
    .pipe(plumber())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(rename({ dirname: '' }))
    .pipe(dest('../scripts/core'))
    .pipe(browser.reload({
      stream: true,
      once: true
    }));
};

const buildIndex = () => {
  return src('../html/*.*')
    .pipe(index({
      // Title for the index page
      'title': 'Modules Index',
      // written out before index contents
      'prepend-to-output': () => `
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, initial-scale = 1.0, shrink-to-fit=no">
          <link rel="stylesheet" href="../css/main.css">
        </head>
        <body>
          <style>
            li {
              margin-left: 10px;
              margin-top: 10px;
            }
          </style>`,
      // written out after index contents
      'append-to-output': () => `</body>`,
      // Section heading function used to construct each section heading
      'section-heading-template': () => '',
      // Item function used to construct each list item
      'item-template': (filepath, filename) => {
        return `
          <li class="index__item">
            <a class="index__item-link" href="${filename}">${filename.split('..\\..\\html\\')[1].split('.html')[0]}</a>
          </li>`
        }
      // folders to use as heading, affected by 'relativePath'
      //'pathDepth': 2,
      // part of path to discard e.g. './src/client' when creating index
      //'relativePath': '../../'
    }))
    .pipe(dest('../html'))
};

// Watchers
const watchers = () => {
  // Modules watcher
  watch('modules/**/*.html').on('change', file => {
    console.log(file);
    buildModule(file).then(() => {
      buildIndex();
      // buildTemplate();
    });
  });
  // templates watcher
  // watch('templates/*.html').on('change', file => {
  //   buildTemplate().then(buildIndex);
  // });
  // SCSS watcher
  watch(['scss/*.scss', 'modules/**/*.scss']).on('change', file => buildCSS());
  // JS watcher
  watch(['main.js', 'modules/**/*.js']).on('change', file => buildJS(file));
};

const browserSync = () => {
  return browser.init(null, {
    server: {
      baseDir: '../'
    },
    startPath: 'html/index.html'
  });
};

exports.default = parallel(watchers, buildIndex, browserSync);

// -------------------------------------------------------------------------------------------------------- //

// Production
const production = () => {
  return src('../scripts/core/*.js')
    .pipe(concat('script.js'))
    .pipe(jsObfuscator())
    .pipe(dest('../scripts'));
};

exports.production = production;

// -------------------------------------------------------------------------------------------------------- //

// Create new modules
const htmlTemplate = name => `<section class="${name}">
  ${name}
</section>

<script src="/scripts/core/${name}.js"></script>`;
const cssTemplate = name => `.${name} {

}`;
const jsTemplate = name => `const project = project || {};

project.${name} = () => {
  return {
    init(element, data) {
      const view = this;
      view.el = element;
      view.data = data;
      view.variables();
      view.events();
    },
    variables() {
      const view = this;
    },
    events() {
      const view = this;
    },
  }
};

// nodeList forEach polyfill
window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=function(o,t){t=t||window;for(var i=0;i<this.length;i++)o.call(t,this[i],i,this)});

for (let element of document.querySelectorAll('.${name}')) {
  const data = element.dataset;
  const obj = new project.${name};
  obj.init(element, data);
}`;

const newModule = callback => {
  const name = argv.name;
  if(typeof(name) !== 'string') {
    console.log('Por favor especifique o nome no formato --name nome');
    callback();
    return;
  }
  const filePath = `modules/${name}/`
  fs.writeFile(`${name}.html`, htmlTemplate(name), file => {
    new Promise(resolve => {
      return src(`${name}.html`).pipe(dest(filePath)).on('end', resolve);
    }).then(() => {
      buildModule(`${filePath}${name}.html`).then(buildIndex);
      src(`${name}.html`).pipe(clean());
    })
  });
  fs.writeFile(`${name}.scss`, cssTemplate(name), file => {
    new Promise(resolve => {
      return src(`${name}.scss`).pipe(dest(filePath)).on('end', resolve);
    }).then(() => {
      buildCSS(`${filePath}${name}.scss`);
      src(`${name}.scss`).pipe(clean());
    })
  });
  if (!argv.nojs) {
    fs.writeFile(`${name}.js`, jsTemplate(name), file => {
      new Promise(resolve => {
        return src(`${name}.js`).pipe(dest(filePath)).on('end', resolve);
      }).then(() => {
        buildJS(`${filePath}${name}.js`);
        src(`${name}.js`).pipe(clean());
      })
    });
  }
  callback();
}
const newComponent = callback => {
  const name = argv.name;
  if(typeof(name) !== 'string') {
    console.log('Por favor especifique o nome no formato --name nome');
    callback();
    return;
  }
  const filePath = `components/${name}/`
  fs.writeFile(`${name}.html`, htmlTemplate(name), file => {
    new Promise(resolve => {
      return src(`${name}.html`).pipe(dest(filePath)).on('end', resolve);
    }).then(() => {
      buildComponent(`${filePath}${name}.html`);
    })
  });
  fs.writeFile(`${name}.scss`, cssTemplate(name), file => {
    new Promise(resolve => {
      return src(`${name}.scss`).pipe(dest(filePath)).on('end', resolve);
    }).then(() => {
      buildCSS(`${filePath}${name}.scss`);
    })
  });
  fs.writeFile(`${name}.js`, jsTemplate(name), file => {
    new Promise(resolve => {
      return src(`${name}.js`).pipe(dest(filePath)).on('end', resolve);
    }).then(() => {
      buildJS(`${filePath}${name}.js`);
    })
  });
  callback();
}

exports.newModule = newModule;
exports.newComponent = newComponent;