import ResourceName from '../resources/resource/ResourceName';
import { Resources } from '../resources/resource/Resource';
import createZip from './create-zip';
import triggerDownload from './trigger-download';

const pickResources = (name: ResourceName, resources: Resources) => {
    switch(name) {
        case ResourceName.images:
            return resources.images;
        case ResourceName.scripts:
            return resources.scripts;
        case ResourceName.fonts:
            return resources.fonts;
        default:
            return resources.stylesheets;
    }
}

export default async function downloadAll(name: ResourceName, resources: Resources, fileName: string) {
    const zip = await createZip(
        pickResources(name, resources)
            .map(resource => resource.url)
    )
    await triggerDownload(URL.createObjectURL(zip), fileName)
}
