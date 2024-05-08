import React, { ReactNode, CSSProperties, PropsWithChildren } from 'react';

import { Resource, Resources, StylesheetResource } from './resource/Resource';
import ResourceName from './resource/ResourceName';
import Stylesheet from './stylesheet/Stylesheet';
import { fileNameFrom } from '../../parsers/urls';
import { ResourceDownloader } from '../../actions/download';

function renderResources(
    name: ResourceName,
    resources: Resources,
    onDownload: ResourceDownloader,
    onDownloadAll: (resources: Resource[]) => void
): ReactNode[] {
    switch(name) {
        case ResourceName.stylesheets:
            return resources.stylesheets.map(stylesheet => renderStylesheet(stylesheet, onDownload, onDownloadAll));
        case ResourceName.images:
            return resources.images.map(image => renderWrappedImage(image, onDownload));
        case ResourceName.scripts:
            return resources.scripts.map(script => renderScript(script, onDownload));
        case ResourceName.fonts:
            return resources.fonts.map(font => renderWrappedFont(font, onDownload));
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
    onDownload: ResourceDownloader, 
    onDownloadAll: (resources: Resource[]) => void
) => (
    <Stylesheet
        stylesheet={stylesheet}
        downloadLink={renderDownloadLink(stylesheet, onDownload)}
        onClickDownloadAll={onDownloadAll}
        onClickDownload={onDownload}
    />
)

const renderImage = (resource: Resource, onDownload: ResourceDownloader) => (
    <>
        <img src={resource.url} />
        {renderDownloadLink(resource, onDownload)}
    </>
)
const renderWrappedImage = (resource: Resource, onDownload: ResourceDownloader) => (
    <ResourceWrapper>
        {renderImage(resource, onDownload)}
    </ResourceWrapper>
)

const renderScript = (resource: Resource, onDownload: ResourceDownloader) => (
    <ResourceWrapper>
        <div className="url"><a href={resource.url} target="_blank">{resource.url}</a></div>
        {renderDownloadLink(resource, onDownload)}
    </ResourceWrapper>
)

const renderFont = (resource: Resource, onDownload: ResourceDownloader) => {
    const fontName = `font-${fileNameFrom(resource.url).split('.')[0]}`
    const style: CSSProperties = {
        fontFamily: fontName
    }
    return (
        <>
            <style>
                {`@font-face {
                    font-family: ${fontName};
                    src: url(${resource.url})
                }`}
            </style>
            <div className="font-example" style={style}>Grumpy wizards make toxic brew for the evil Queen and Jack.</div>
            {renderDownloadLink(resource, onDownload)}
        </>
    )
}
const renderWrappedFont = (resource: Resource, onDownload: ResourceDownloader) => {
    return (
        <ResourceWrapper>
            {renderFont(resource, onDownload)}
        </ResourceWrapper>
    )
}

const renderDownloadLink = (resource: Resource, onDownload: ResourceDownloader) => {
    const fileName = fileNameFrom(resource.url)
    return (
        <div className="url">
            {fileName} - <a title={resource.url} href={resource.url} onClick={(e) => {e.preventDefault(); onDownload(resource, fileName)}}>Download</a>
        </div>
    );
}

export default renderResources;

export {
    renderImage, 
    renderFont
}
