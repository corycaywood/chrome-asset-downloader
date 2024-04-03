import ResourceName from '../resources/resource/ResourceName';
import { Resources } from '../resources/resource/Resource';

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

const pickResourceUrls = (name: ResourceName, resources: Resources) => 
    pickResources(name, resources).map(resource => resource.url);

export {
    pickResources,
    pickResourceUrls
};
