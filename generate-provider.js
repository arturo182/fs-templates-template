const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { URL } = require('url');

const baseUrl = process.argv[process.argv.length - 1];
if (!baseUrl.startsWith('http')) {
  console.log('Usage: node generate-provider.js <baseUrl>');
  process.exit(1);
}

const ignoredDirs = [
  'static'
];

const templates = fs.readdirSync(__dirname)
  .filter((name) => {
    return fs.statSync(path.join(__dirname, name)).isDirectory()
      && !ignoredDirs.includes(name)
      && !name.startsWith('.');
  });

if (templates.length == 0) {
  console.log('No templates found, exiting.');
  process.exit(0);
}

console.log(`Found ${templates.length} templates: [${templates.join(', ')}]`);

const templatesPath = path.join(__dirname, 'static', 'projecttemplates');

const infos = [];

templates.forEach((template) => {
  const templatePath = path.join(__dirname, template);
  const destPath = path.join(templatesPath, template);

  console.log(`Processing ${template}`);

  fs.mkdirSync(destPath, { recursive: true });

  fs.readdirSync(templatePath)
    .filter((name) => name != 'template.json')
    .forEach((name) => {
      fs.cpSync(path.join(templatePath, name), path.join(destPath, name));
  });

  const fixUrl = (url) => url.startsWith('http') ? url : new URL(url, `${baseUrl}/projecttemplates/${template}/`).toString();

  const info = require(path.join(templatePath, 'template.json'));
  info.iconURL = fixUrl(info.iconURL);
  info.projectURL = fixUrl(info.projectURL);
  if (info.cloudServicesTemplateURL)
    info.cloudServicesTemplateURL = fixUrl(info.cloudServicesTemplateURL);

  infos.push(info);
});

fs.writeFileSync(path.join(templatesPath, 'index.json'), JSON.stringify(infos, null, 2));
