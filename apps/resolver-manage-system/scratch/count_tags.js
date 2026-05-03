import fs from 'fs';
const content = fs.readFileSync('/Users/abhishek/Desktop/resolve/Risolver/apps/resolver-manage-system/src/pages/Dashboard.jsx', 'utf8');
const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;
const openButtons = (content.match(/<button/g) || []).length;
const closeButtons = (content.match(/<\/button>/g) || []).length;
const openSpans = (content.match(/<span/g) || []).length;
const closeSpans = (content.match(/<\/span>/g) || []).length;
console.log({ openDivs, closeDivs, openButtons, closeButtons, openSpans, closeSpans });
