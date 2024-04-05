import { groupBy, pick } from 'lodash';
import { Resource, Resources } from '../resources/resource/Resource';
import { getImagesFrom, getFontsFrom } from '../parsers/stylesheet';
import ResourceName from '../resources/resource/ResourceName';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

export default async function subscribeResources(callback: (resources: Resources) => void) : Promise<void> {
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(async () => callback(await getResources()));
    
    callback(await getResources());
}

const getResources = () : Promise<Resources> => new Promise((resolve) => {
    chrome.devtools.inspectedWindow.getResources(async resources => {
        console.log(resources)
        resolve(
            await parseResources(resources as ChromeResource[])
        );
    });
})

const parseResources = async (chromeResources: ChromeResource[]) => {
    const groupedResources = groupBy(chromeResources, ({type}) => type);

    const resources = {
        stylesheets: await urlsFromStylesheets(groupedResources.stylesheet),
        scripts: createResource(groupedResources.script || [], ResourceName.scripts),
        images: createResource(groupedResources.image || [], ResourceName.images),
        fonts: createResource(groupedResources.font || [], ResourceName.fonts)
    };

    return {
        ...resources,
        images: mergeImages(resources),
        fonts: mergeFonts(resources)
    }
}

const urlsFromStylesheets = (resources: ChromeResource[]) => Promise.all(resources.map(async (resource) => {
    const { content } = await getResourceContent(resource);
    const images = getImagesFrom(content || '', resource.url)
        .map(url => ({
            url,
            type: ResourceName.images
        }));
    const fonts = getFontsFrom(content || '', resource.url)
        .map(url => ({
            url,
            type: ResourceName.fonts
        }));
    
    return {
        url: resource.url,
        type: ResourceName.stylesheets,
        images,
        fonts
    };
}));

const createResource = (resources: ChromeResource[], type: ResourceName): Resource[] => resources
    .filter(resource => resource.url.startsWith('http:') || resource.url.startsWith('https:'))
    .map(resource => ({
        url: resource.url,
        type,
        getContent: async () => await getResourceContent(resource)
    }));

const mergeImages = (resources: Resources) => resources.stylesheets.flatMap(it => it.images)
    .filter(stylesheetImage => resources.images.find(image => image.url == stylesheetImage.url))
    .concat(resources.images);

const mergeFonts = (resources: Resources) => resources.stylesheets.flatMap(it => it.fonts)
    .filter(stylesheetFont => resources.fonts.find(font => font.url == stylesheetFont.url))
    .concat(resources.fonts)

const getResourceContent = async (resource: ChromeResource) : Promise<{content: string, encoding: string}> => 
    new Promise(resolve => resource.getContent((content, encoding) => resolve({content, encoding})));
