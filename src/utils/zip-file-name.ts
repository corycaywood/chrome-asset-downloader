import ResourceName from '../resources/resource/ResourceName';

const replaceSpaces = (text: string) => text.replace(/\s/g, "_");

const zipFileName = (name: ResourceName, title?: string) => `${replaceSpaces(title || 'assets')}-${name.toLowerCase()}.zip`;

export default zipFileName;
