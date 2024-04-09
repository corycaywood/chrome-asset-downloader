import { ZipWriter } from '@zip.js/zip.js';
import { chunk } from 'lodash';

import getResourceBlob from './get-resource-blob';
import { fileNameFrom } from '../parsers/urls';
import { Resource } from '../components/resources/resource/Resource';

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
                const blob = await getResourceBlob(item);
                const fileName = fileNameFrom(item.url);

                zipAction(filenameWithPath(fileName, item.type.toLowerCase()), blob)
                onProgress(progress++ / resources.length * 100);
            })
        );
    }

    zipWriter.close();

    return await new Response(zipFileStream.readable).blob();
}

const filenameWithPath = (filename: string, path?: string) => (path && `${path}/`) + filename;
