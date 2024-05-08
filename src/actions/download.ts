import { Resource } from '../components/resources/resource/Resource';
import getResourceBlob from './get-resource-blob';
import triggerDownload from './trigger-download';

type ResourceDownloader = (resource: Resource, fileName: string) => void;

const download : ResourceDownloader = async (resource: Resource, fileName: string) => {
    const blob = await getResourceBlob(resource);
    const url = URL.createObjectURL(blob);

    triggerDownload(url, fileName);
}

export default download;

export { ResourceDownloader }
