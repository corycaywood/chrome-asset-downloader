import { groupBy, pick } from 'lodash';
import { Resources } from '../resources/resource/Resource';
import { getImagesFrom, getFontsFrom } from '../parsers/stylesheet';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

export default async function subscribeResources(callback: (resources: Resources) => void) : Promise<void> {
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(async () => callback(await getResources()));
    
    callback(await getResources());
}

const getResources = () : Promise<Resources> => new Promise((resolve) => {
    chrome.devtools.inspectedWindow.getResources(async resources => {
        resolve(
            await parseResources(resources as ChromeResource[])
        );
    });
})

const parseResources = async (chromeResources: ChromeResource[]) => {
    const groupedResources = groupBy(chromeResources, ({type}) => type);

    const resources = {
        stylesheets: await urlsFromStylesheets(groupedResources.stylesheet),
        scripts: pickUrls(groupedResources.script),
        images: pickUrls(groupedResources.image),
        fonts: pickUrls(groupedResources.font)
    };

    return {
        ...resources,
        images: mergeImages(resources),
        fonts: mergeFonts(resources)
    }
}

const urlsFromStylesheets = (resources: ChromeResource[]) => Promise.all(resources.map(async (resource) => {
    const content = await getResourceContent(resource);
    const images = getImagesFrom(content || '', resource.url)
        .map(url => ({url}));
    const fonts = getFontsFrom(content || '', resource.url)
        .map(url => ({url}));
    
    return {
        url: resource.url,
        images,
        fonts
    };
}));

const pickUrls = (resource?: ChromeResource[]) => resource?.map(resource => ({url: resource.url}))
    .filter(resource => !resource.url.startsWith('chrome-extension:')) 
    || [];

const mergeImages = (resources: Resources) => [...new Set(resources.images.concat(resources.stylesheets.flatMap(it => it.images)))];

const mergeFonts = (resources: Resources) => [...new Set(resources.fonts.concat(resources.stylesheets.flatMap(it => it.fonts)))];

const getResourceContent = async (resource: ChromeResource) : Promise<string | null> => 
    new Promise(resolve => resource.getContent(content => resolve(content)));
