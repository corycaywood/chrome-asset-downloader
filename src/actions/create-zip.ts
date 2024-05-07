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
    const success: string[] = [];
    const failed: string[] = [];

    const addToZip = async (fileName: string, blob: Blob) => {
        let finished = false;
        let incrementor = 0;

        while(!finished) {
            const fileNameIncremeted = incrementor == 0
                ?  fileName
                : `${fileName}(${incrementor})`;
            try {
                await zipWriter.add(fileNameIncremeted, blob.stream());
                finished = true;
            } catch(error: any) {
                if (error.message == 'File already exists') {
                    incrementor++;
                } else {
                    console.error(error);
                    finished = true;
                }
            }
        }
    };

    for await (const urlsChunk of chunk(resources, concurrent)) {
        const results = await Promise.allSettled(
            urlsChunk.map(async (item) => {
                const blob = await getResourceBlob(item);
                const fileName = fileNameFrom(item.url);

                addToZip(filenameWithPath(fileName, item.type.toLowerCase()), blob);
                onProgress(progress++ / resources.length * 100);
            })
        );
        results.forEach((result, index) => {
            const url = urlsChunk[index].url;

            if (result.status == 'rejected') {
                failed.push(url)
            } else {
                success.push(url)
            }
        })
    }

    zipWriter.close();

    const zip = await new Response(zipFileStream.readable).blob();
    return {
        zip,
        failed
    }
}

const filenameWithPath = (filename: string, path?: string) => (path && `${path}/`) + filename;
