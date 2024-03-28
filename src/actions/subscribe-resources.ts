import { groupBy } from 'lodash';
import { Resources } from '../resources/resource/Resource';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

const pickUrls = (resource?: ChromeResource[]) => resource?.map(resource => ({url: resource.url}))
    .filter(resource => !resource.url.startsWith('chrome-extension:')) 
    || [];

const parseResources = (resources: ChromeResource[]) => {
    const groupedResources = groupBy(resources, ({type}) => type);

    return {
        stylesheets: pickUrls(groupedResources.stylesheet),
        scripts: pickUrls(groupedResources.script),
        images: pickUrls(groupedResources.image),
        fonts: pickUrls(groupedResources.font)
    };
}

const getResources = () : Promise<Resources> => new Promise(resolve => {
    chrome.devtools.inspectedWindow.getResources(resources => {
        resolve(
            parseResources(resources as ChromeResource[])
        )
    });
})

export default async function subscribeResources(callback: (resources: Resources) => void) : Promise<void> {
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(async () => callback(await getResources()));
    
    callback(await getResources());
}
