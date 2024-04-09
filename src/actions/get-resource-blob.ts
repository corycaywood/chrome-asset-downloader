import { Resource } from '../components/resources/resource/Resource';
import mimeFromExt from '../parsers/mime-type';
import { extensionFrom } from '../parsers/urls';

const getResourceBlob = async (resource: Resource) => {
    if (!resource.getContent) {
        return fetchBlob(resource.url);
    }

    const content = await resource.getContent();
    let type = mimeFromExt(extensionFrom(resource.url) || '', resource.type);

    return await blobFromResourceContent(content.content, content.encoding, type);
}

const blobFromResourceContent = async (content: string, encoding: string, type: string) => {
    if (encoding == 'base64') {
        return await fetchBlob(`data:${type},base64,${content}`);
    } else {
        return new Blob([content], {type});
    }
}

const fetchBlob = async (url: string) => {
    const res = await fetch(url);
    return await res.blob();
}

export default getResourceBlob;
