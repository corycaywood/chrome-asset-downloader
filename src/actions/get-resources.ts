import { groupBy } from 'lodash';

interface ChromeResource extends chrome.devtools.inspectedWindow.Resource {
    type: "stylesheet" | "script" | "sm-script" | "image" | "font" | "document"
}

export default function getResources() {
    return new Promise(resolve => {
        chrome.devtools.inspectedWindow.getResources(resources => {
            const chromeResources = resources as ChromeResource[]
            groupBy(chromeResources, ({type}) => type)
        })
    });
}
