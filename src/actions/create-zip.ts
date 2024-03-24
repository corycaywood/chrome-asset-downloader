import { ZipWriter, BlobWriter, HttpReader } from '@zip.js/zip.js';
import { chunk } from 'lodash';

import { fileNameFrom } from '../utils/urls';

export default async function createZip(urls: string[], concurrent: number = 5) {
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'))

    const zipAction = (url: string) => zipWriter.add(fileNameFrom(url), new HttpReader(url));

    await chunk(urls, concurrent)
        .map(chunk => chunk.map(zipAction))
        .forEach(async (chunk) => await Promise.all(chunk));

    return zipWriter.close();
}
