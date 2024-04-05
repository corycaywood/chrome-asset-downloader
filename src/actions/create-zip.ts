import { ZipWriter } from '@zip.js/zip.js';
import { chunk } from 'lodash';

import { fileNameFrom, extensionFrom } from '../parsers/urls';
import { Resource } from '../resources/resource/Resource';
import ResourceName from '../resources/resource/ResourceName';
import mimeFromExt from '../parsers/mime-type';

export default async function createZip(
    resources: Resource[], 
    onProgress: (progress: number) => void, 
    concurrent: number = 5
) {
    const zipFileStream = new TransformStream();
    const zipWriter = new ZipWriter(zipFileStream.writable);
    let progress = 0;

    const zipAction = (fileName: string, blob: Blob) => zipWriter.add(fileName, blob.stream());

    for await (const urlsChunk of chunk(resources, concurrent)) {
        await Promise.all(
            urlsChunk.map(async (item) => {
                const blob = await getContentBlob(item);
                zipAction(filenameWithPath(blob.fileName, item.type.toLowerCase()), blob.blob)
                onProgress(progress++ / resources.length * 100);
            })
        );
    }

    zipWriter.close();

    return await new Response(zipFileStream.readable).blob();
}

const getContentBlob = async (resource: Resource) => {
    if (!resource.getContent) {
        return await fetchAction(resource.url);
    }
    
    const content = await resource.getContent();
    let type = mimeFromExt(extensionFrom(resource.url) || '', resource.type);

    const blob = await blobFromResourceContent(content.content, content.encoding, type);
    return { 
        blob,
        fileName: fileNameFrom(resource.url)
    }
}

const blobFromResourceContent = async (content: string, encoding: string, type: string) => {
    if (encoding == 'base64') {
        const blob = await fetchAction(`data:${type},base64,${content}`);
        return blob.blob
    } else {
        return new Blob([content], {type});
    }
}

const fetchAction = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    let fileName = '';
    if (!extensionFrom(url)) {
        fileName = fileNameFrom(url) + `.${blob.type.replace(/^.*?\//g, '')}`;
    } else {
        fileName = fileNameFrom(url);
    }
    
    return { blob, fileName };
}

const filenameWithPath = (filename: string, path?: string) => (path && `${path}/`) + filename;
