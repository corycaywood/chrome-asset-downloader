import triggerDownload from './trigger-download';

export default async function download(url: string, fileName: string) {
    return fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            triggerDownload(url, fileName)
        })
}
