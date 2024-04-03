import DownloadableUrl from '../DownloadableUrl';

import createZip from './create-zip';
import triggerDownload from './trigger-download';

export default async function downloadAll(urls: DownloadableUrl[], zipFileName: string, onProgress: (progress: number) => void) {
    const zip = await createZip(urls, onProgress);
    await triggerDownload(URL.createObjectURL(zip), zipFileName);
}
