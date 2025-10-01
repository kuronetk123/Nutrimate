import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export const loadHtmlTemplate = (templateName, values) => {
    // const filePath = path.resolve('templates', `${templateName}.html`);
    const filePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);
    return template(values);
};
