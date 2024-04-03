const replaceSpaces = (text: string) => text.replace(/\s/g, "_");

const zipFileName = (title?: string) => `${replaceSpaces(title || 'assets')}.zip`;

export default zipFileName;
