import ResourceName from '../components/resources/resource/ResourceName';
import { Resources } from '../components/resources/resource/Resource';

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

export {
    pickResources
};
