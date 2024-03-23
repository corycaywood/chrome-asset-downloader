interface Resource {
    url: string;
}

interface Resources {
    stylesheets: Resource[],
    scripts: Resource[],
    images: Resource[],
    fonts: Resource[]
}

export {
    Resource,
    Resources
}
