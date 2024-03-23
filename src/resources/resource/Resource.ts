interface Resource {
    url: string;
}

interface Resources {
    stylesheets: Resource[],
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
    emptyResources
}
