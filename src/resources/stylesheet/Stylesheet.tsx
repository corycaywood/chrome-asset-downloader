import React, { ReactNode, useState } from 'react';

import { StylesheetResource } from '../resource/Resource'
import StylesheetExpandButton from './StylesheetExpandButton';
import DownloadableUrl from '../../DownloadableUrl';

interface Props {
    stylesheet: StylesheetResource;
    downloadLink: ReactNode;
    onClickDownload: (urls: DownloadableUrl[]) => void;
}

function Stylesheet(props: Props) {
    const [expanded, setExpanded] = useState(false);

    const hasSubResources = () => props.stylesheet.images.length > 0 || props.stylesheet.fonts.length > 0;

    const collectResources = () => props.stylesheet.fonts.map(font => ({url: font.url, savePath: 'fonts'}))
        .concat(props.stylesheet.images.map(image => ({url: image.url, savePath: 'images'})));

    return (
        <div className='stylesheet-container'>
            {hasSubResources() && <StylesheetExpandButton 
                expanded={expanded} 
                onClickExpand={() => setExpanded(!expanded)} 
            />}{hasSubResources() && <button className="btn btn-danger" onClick={() => props.onClickDownload(collectResources())}>
                Download Assets
            </button>}
            <div className="url"><a href={props.stylesheet.url} target="_blank">{props.stylesheet.url}</a></div>
            {props.downloadLink}
        </div>
    );
}

export default Stylesheet;
