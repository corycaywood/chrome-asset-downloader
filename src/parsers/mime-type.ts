import ResourceName from '../resources/resource/ResourceName';

export default function mimeTypeFrom(extension: string, type: ResourceName) {
    if (extension == '') {
        return 'text/plain';
    }

    switch(type) {
        case ResourceName.images:
            if (extension == 'svg') {
                return 'image/svg+xml'
            } else {
                return `image/${extension}`
            }
        case ResourceName.stylesheets:
            return 'text/css';
        case ResourceName.scripts:
            return 'text/javascript';
        case ResourceName.fonts:
            return fontMimeFrom(extension);
        default:
            return 'text/plain';
    }
}

const fontMimeFrom = (ext: String) => {
    switch(ext) {
        case 'svg':
            return 'image/svg+xml';
        case 'otf':
            return 'application/x-font-ttf';
        case 'ttf':
            return 'application/x-font-ttf'
        case 'woff':
            return 'application/font-woff';
        default:
            return 'application/font-woff2';
    }
}
