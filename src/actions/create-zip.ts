import { ZipWriter } from '@zip.js/zip.js';
import { chunk } from 'lodash';

import DownloadableUrl from '../DownloadableUrl';
import { fileNameFrom, extensionFrom } from '../parsers/urls';

export default async function createZip(
    urls: DownloadableUrl[], 
    onProgress: (progress: number) => void, 
    concurrent: number = 5
) {
    const zipFileStream = new TransformStream();
    const zipWriter = new ZipWriter(zipFileStream.writable);
    let progress = 0;

    const zipAction = (fileName: string, blob: Blob) => zipWriter.add(fileName, blob.stream());

    for await (const urlsChunk of chunk(urls, concurrent)) {
        await Promise.all(
            urlsChunk.map(async (item) => {
                const blob = await fetchAction(item.url);
                zipAction(filenameWithPath(blob.fileName, item.savePath), blob.blob)
                onProgress(progress++ / urls.length * 100);
            })
        );
    }

    zipWriter.close();

    return await new Response(zipFileStream.readable).blob();
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
