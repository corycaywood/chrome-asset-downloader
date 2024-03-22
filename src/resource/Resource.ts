import TabName from './ResourceName';

interface Resource {
    url: string;
}

interface FontResource extends Resource {
    dataUri: string;
}

interface Resources {
    stylesheets: Resource[],
    scripts: Resource[],
    images: Resource[],
    fonts: FontResource[]
}

export {
    Resource,
    Resources,
    FontResource
}
