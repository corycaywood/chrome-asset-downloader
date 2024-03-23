export default function downloadFont(url: string) {
    new Promise((resolve, reject) => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    reject("Failed to download: " + res.status)
                    return
                }
                    
                res.blob().then(blob => {
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        resolve(reader.result)
                    }
                })
            })
    })
}
