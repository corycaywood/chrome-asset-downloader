import { groupBy } from 'lodash';
import { Resource, Resources } from '../components/resources/resource/Resource';
import { getImagesFrom, getFontsFrom } from '../parsers/stylesheet';
import ResourceName from '../components/resources/resource/ResourceName';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

export default async function subscribeResources(callback: (resources: Resources) => void) {
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
        stylesheets: await createStylesheetResource(groupedResources.stylesheet),
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

const createStylesheetResource = (resources: ChromeResource[]) => Promise.all(resources.map(async (resource) => {
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

const mergeImages = (resources: Resources) => mergeResources(
    resources.stylesheets.flatMap(it => it.images),
    resources.images
)

const mergeFonts = (resources: Resources) => mergeResources(
    resources.stylesheets.flatMap(it => it.fonts),
    resources.fonts
)

const mergeResources = (first: Resource[], second: Resource[]) => first
    .filter(firstResource => second.find(secondResource => firstResource.url == secondResource.url))
    .concat(second)

const getResourceContent = async (resource: ChromeResource) : Promise<{content: string, encoding: string}> => 
    new Promise(resolve => resource.getContent((content, encoding) => resolve({content, encoding})));
