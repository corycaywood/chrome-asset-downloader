export default function download(url: string, fileName: string) {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName)
            document.body.append(link);
            link.click();
            document.body.removeChild(link);
        })
}
