import { groupBy } from 'lodash';
import { Resources } from '../resources/resource/Resource';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

const pickUrls = (resource?: ChromeResource[]) => resource?.map(resource => ({url: resource.url})) || []

export default function getResources() : Promise<Resources> {
    return new Promise(resolve => {
        chrome.devtools.inspectedWindow.getResources(resources => {
            const chromeResources = resources as ChromeResource[];
            const groupedResources = groupBy(chromeResources, ({type}) => type);

            resolve({
                stylesheets: pickUrls(groupedResources.stylesheet),
                scripts: pickUrls(groupedResources.script),
                images: pickUrls(groupedResources.image),
                fonts: pickUrls(groupedResources.font)
            });
        })
    });
}
