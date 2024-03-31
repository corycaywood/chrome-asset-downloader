const IMAGE_REGEX = /url\([^\)]*?(\.jpg|\.png|\.gif)[^\)]*?\)/ig;
const IMAGE_SVG_REGEX = /url\([^\)]*?(\.svg)[^\)]*?\)/ig;
const FONT_REGEX = /url\([^\)]*?(\.eot|\.woff|\.woff2|\.otf|\.ttf)[^\)]*?\)/ig;
const FONT_SVG_REGEX = /@font-face[^\}]*?\{[^\}]*?(url\([^\)]*?(\.svg)[^\)]*?\)[^\}]*?\})/ig;
const FONT_SVG_REGEX_STRIP = /url\([^\)]*?(\.svg)[^\)]*?\)/ig;
const URL_STARTS_WITH_HOSTNAME_REGEX = /^[^/^.][a-zA-Z0-9]*?\.[^/]*?\//;
const URL_HOSTNAME_REGEX = /[^/]*\//;

const getFontsFrom = (stylesheet: string, stylesheetUrl: string) => {
    const fonts = getFonts(stylesheet)
        .concat(getSvgFonts(stylesheet));

    return parseUrls(fonts, stylesheetUrl);
}

const getImagesFrom = (stylesheet: string, stylesheetUrl: string) => {
    const images = getImages(stylesheet)
        .concat(getSvgImages(stylesheet));

    return parseUrls(images, stylesheetUrl);
}

const getFonts = (stylesheet: string) => matchesOrEmpty(stylesheet, FONT_REGEX);

const getSvgFonts = (stylesheet: string) => matchesOrEmpty(stylesheet, FONT_SVG_REGEX)
    .map(url => url.match(FONT_SVG_REGEX_STRIP)?.at(0) || '')
    .filter(url => url != '');

const getImages = (stylesheet: string) => matchesOrEmpty(stylesheet, IMAGE_REGEX);

const getSvgImages = (stylesheet: string) => {
    // Need to find and filter the SVG fonts from the SVG images because it's not possible to do this with Regex
    const svgFonts = getSvgFonts(stylesheet);
    return matchesOrEmpty(stylesheet, IMAGE_SVG_REGEX)
        .filter(it => svgFonts.indexOf(it) == -1)
}

const matchesOrEmpty = (text: string, regex: RegExp) => text.match(regex) || [] as string[];

const parseUrls = (urls: string[], stylesheetUrl: string) => urls
    .map(url => stripUrl(url))
    .map(url => updateHostName(url, hostNameWithProtocol(stylesheetUrl)));

const hostNameWithProtocol = (stylesheetUrl: string) => {
    const url = new URL(stylesheetUrl);
    return url.protocol + "//" + url.hostname + url.pathname;
}

const stripUrl = (url: string) => url.replace(/url\((.*?)\)/g, '$1')
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/\s/g, "")
    .replace(/^(\/\/)/g, "");

const updateHostName = (url: string, hostName: string) => {
    const startsWithHostname = url.match(URL_STARTS_WITH_HOSTNAME_REGEX);
    const hostNameFromUrl = url.match(URL_HOSTNAME_REGEX);

    if (startsWithHostname != null && hostNameFromUrl != null) {
		hostName = "https://" + hostNameFromUrl[0];
		url = url.replace(/[^/]*\//, "");
	}

	var newUrl = new URL(url, hostName);
	return newUrl.href;
}

export {
    getFontsFrom,
    getImagesFrom
}
