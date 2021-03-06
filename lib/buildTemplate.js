const path = require('path');
const fsx = require('fs-extra');
const setScope = require('./setScope');
const reportError = require('./utils/reportError');

module.exports = function buildTemplate(components, buildOption) {
  if (!Array.isArray(components)) {
    reportError('something wrong with building Template: components is not an array');
  }
  components.forEach((component) => {
    const templatePath = path.resolve(buildOption.srcPath, component.dir, component.name, `${component.base}`);
    if (fsx.existsSync(templatePath)) {
      try {
        const template = fsx.readFileSync(templatePath, 'utf8');
        setScope(template, component).then((res) => {
          fsx.ensureDirSync(path.resolve(buildOption.builtTemplatePath, component.dir));
          fsx.writeFileSync(path.resolve(buildOption.builtTemplatePath, component.dir, `${component.base}`), res);
        });
      } catch (e) {
        reportError(e);
      }
    } else {
      reportError(`something wrong with building Template: ${templatePath} is non existence`);
    }
  });
};

