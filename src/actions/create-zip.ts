import { ZipWriter } from '@zip.js/zip.js';
import { chunk } from 'lodash';

import { fileNameFrom, extensionFrom } from '../parsers/urls';

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

export default async function createZip(urls: string[], onProgress: (progress: number) => void, concurrent: number = 5) {
    const zipFileStream = new TransformStream();
    const zipWriter = new ZipWriter(zipFileStream.writable);
    let progress = 0;

    const zipAction = ({fileName, blob}: {fileName: string, blob: Blob}) => {
        onProgress(progress++ / urls.length * 100);
        zipWriter.add(fileName, blob.stream());
    }

    for await (const urlsChunk of chunk(urls, concurrent)) {
        const blobs = await Promise.all(urlsChunk.map(fetchAction));
        blobs.forEach(zipAction);
    }

    zipWriter.close();

    return await new Response(zipFileStream.readable).blob();
}
