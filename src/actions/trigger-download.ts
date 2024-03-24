export default async function triggerDownload(url: string, fileName: string) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
}
