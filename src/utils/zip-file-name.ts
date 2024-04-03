const replaceSpaces = (text: string) => text.replace(/\s/g, "_");

const zipFileName = (name: string, title?: string) => `${replaceSpaces(title || 'assets')}-${name.toLowerCase()}.zip`;

export default zipFileName;
