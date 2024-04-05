import React, { ReactNode, CSSProperties, PropsWithChildren } from 'react';

import { Resource, Resources, StylesheetResource } from './resource/Resource';
import ResourceName from './resource/ResourceName';
import Stylesheet from './stylesheet/Stylesheet';
import { fileNameFrom } from '../parsers/urls';

function renderResources(
    name: ResourceName,
    resources: Resources,
    onDownload: (url: string, fileName: string) => void,
    onDownloadAll: (resources: Resource[]) => void
): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => renderStylesheet(stylesheet, onDownload, onDownloadAll));
        case ResourceName.images:
            return resources.images.map(image => renderWrappedImage(image.url, onDownload));
        case ResourceName.scripts:
            return resources.scripts.map(script => renderScript(script.url, onDownload));
        case ResourceName.fonts:
            return resources.fonts.map(font => renderWrappedFont(font.url, onDownload));
        default:
            return [<div></div>]
    }
}

const ResourceWrapper = (props: PropsWithChildren) => (
    <div className="panel-heading">
        {props.children}
    </div>
)

const renderStylesheet = (
    stylesheet: StylesheetResource, 
    onDownload: (url: string, fileName: string) => void, 
    onDownloadAll: (resources: Resource[]) => void
) => (
    <Stylesheet
        stylesheet={stylesheet}
        downloadLink={renderDownloadLink(stylesheet.url, onDownload)}
        onClickDownloadAll={onDownloadAll}
        onClickDownload={onDownload}
    />
)

const renderImage = (url: string, onDownload: (url: string, fileName: string) => void) => (
    <>
        <img src={url} />
        {renderDownloadLink(url, onDownload)}
    </>
)
const renderWrappedImage = (url: string, onDownload: (url: string, fileName: string) => void) => (
    <ResourceWrapper>
        {renderImage(url, onDownload)}
    </ResourceWrapper>
)

const renderScript = (url: string, onDownload: (url: string, fileName: string) => void) => (
    <ResourceWrapper>
        <div className="url"><a href={url} target="_blank">{url}</a></div>
        {renderDownloadLink(url, onDownload)}
    </ResourceWrapper>
)

const renderFont = (url: string, onDownload: (url: string, fileName: string) => void) => {
    const fontName = `font-${fileNameFrom(url).split('.')[0]}`
    const style: CSSProperties = {
        fontFamily: fontName
    }
    return (
        <>
            <style>
                {`@font-face {
                    font-family: ${fontName};
                    src: url(${url})
                }`}
            </style>
            <div className="font-example" style={style}>Grumpy wizards make toxic brew for the evil Queen and Jack.</div>
            {renderDownloadLink(url, onDownload)}
        </>
    )
}
const renderWrappedFont = (url: string, onDownload: (url: string, fileName: string) => void) => {
    return (
        <ResourceWrapper>
            {renderFont(url, onDownload)}
        </ResourceWrapper>
    )
}

const renderDownloadLink = (url: string, onDownload: (url: string, fileName: string) => void) => {
    const fileName = fileNameFrom(url)
    return (
        <div className="url">
            {fileName} - <a title={url} href={url} onClick={(e) => {e.preventDefault(); onDownload(url, fileName)}}>Download</a>
        </div>
    );
}

export default renderResources;

export {
    renderImage, 
    renderFont
}
