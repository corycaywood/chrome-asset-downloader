import { Resource } from '../components/resources/resource/Resource';

import createZip from './create-zip';
import triggerDownload from './trigger-download';

export default async function downloadAll(resources: Resource[], zipFileName: string, onProgress: (progress: number) => void) {
    const zip = await createZip(resources, onProgress);
    await triggerDownload(URL.createObjectURL(zip), zipFileName);
}
