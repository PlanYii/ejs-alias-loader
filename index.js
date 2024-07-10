const ejs = require("ejs");
const path = require("path");

function loader(source) {
  const options = this.getOptions();

  const alias = this._compiler.options.resolve.alias;

  const opts = Object.assign({ compileDebug: true, cache: true }, options);

  const filename = path.relative(process.cwd(), this.resourcePath);

  for(let key in alias) {
    if (key === '@') {
      continue;
    }
    const reg = new RegExp(`${key}(.*?)\\s`, 'g')

    if (reg.test(source)) {
      const _resPath = path.relative(path.resolve(filename, ".."), path.relative(process.cwd(), alias[key]))
      source = source.replace(reg, (match) => {
        const exts = match.split('.')
        const _includePath = match.replace(key, '')
        const _matchPath = exts.length === 2 ? path.join(_resPath, _includePath) : path.join(_resPath, _includePath, '/index.ejs');
        return _matchPath.replace(/\\/g, '/')
      });
    }
  }

  const template = ejs.compile(
    source,
    Object.assign(opts, {
      client: true,
      filename,
      webpack: this,
    })
  );
  const html = template(options.data || {});
  return html
  // return "module.exports = " + template.toString();
}

module.exports = loader;
