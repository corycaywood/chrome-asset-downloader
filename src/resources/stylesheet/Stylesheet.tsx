import React, { ReactNode, useState } from 'react';

import { StylesheetResource } from '../resource/Resource'
import DownloadableUrl from '../../DownloadableUrl';
import ExpandButton from './ExpandButton';
import ExpandableSection from './ExpandableSection';
import StylesheetSubResources from './StylesheetSubResources';
import ResourceName from '../resource/ResourceName';

interface Props {
    stylesheet: StylesheetResource;
    downloadLink: ReactNode;
    onClickDownloadAll: (urls: DownloadableUrl[]) => void;
    onClickDownload: (url: string, filename: string) => void;
}

function Stylesheet(props: Props) {
    const [expanded, setExpanded] = useState(false);

    const hasImages = () => props.stylesheet.images.length > 0;
    const hasFonts = () => props.stylesheet.fonts.length > 0;
    const hasSubResources = () => hasImages() || hasFonts();

    const collectResources = () => props.stylesheet.fonts.map(font => ({url: font.url, savePath: 'fonts'}))
        .concat(props.stylesheet.images.map(image => ({url: image.url, savePath: 'images'})));

    return (
        <div className="stylesheet-container">
            <div className="panel-heading">
                <div className="button-wrap">
                    {hasSubResources() && <ExpandButton 
                        expanded={expanded} 
                        onClickExpand={() => setExpanded(!expanded)} 
                    />}{hasSubResources() && <button className="btn btn-danger" onClick={() => props.onClickDownloadAll(collectResources())}>
                        Download Assets
                    </button>}
                    <div className="url"><a href={props.stylesheet.url} target="_blank">{props.stylesheet.url}</a></div>
                    {props.downloadLink}
                </div>
            </div>
            <ExpandableSection className="categories panel-body" expanded={expanded}>
                {hasImages() && (
                    <StylesheetSubResources 
                        subResources={props.stylesheet.images} 
                        title={ResourceName.images} 
                        onClickDownloadAll={props.onClickDownloadAll}
                        onClickDownload={props.onClickDownload}
                    />
                )}
                {hasFonts() && (
                    <StylesheetSubResources 
                        subResources={props.stylesheet.fonts} 
                        title={ResourceName.fonts} 
                        onClickDownloadAll={props.onClickDownloadAll}
                        onClickDownload={props.onClickDownload}
                    />
                )}
            </ExpandableSection>
        </div>
    );
}

export default Stylesheet;
