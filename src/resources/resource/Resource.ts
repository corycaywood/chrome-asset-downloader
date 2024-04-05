import ResourceName from "./ResourceName";

interface Resource {
    url: string;
    type: ResourceName;
    getContent?: () => Promise<{content: string, encoding: string}>;
}

interface StylesheetResource extends Resource {
    images: Resource[],
    fonts: Resource[]
}

interface Resources {
    stylesheets: StylesheetResource[],
    scripts: Resource[],
    images: Resource[],
    fonts: Resource[]
}

const emptyResources = {
    stylesheets: [],
    scripts: [],
    images: [],
    fonts: []
}

export {
    Resource,
    Resources,
    StylesheetResource,
    emptyResources
}
