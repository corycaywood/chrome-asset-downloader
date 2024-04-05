import React, { useState } from 'react';

import { Resource } from '../resource/Resource'
import ResourceName from '../resource/ResourceName';
import ExpandButton from './ExpandButton';
import ExpandableSection from './ExpandableSection';
import { renderImage, renderFont } from '../render-resources';

interface Props {
	title: ResourceName;
	subResources: Resource[]
	onClickDownload: (url: string, fileName: string) => void;
	onClickDownloadAll: (resources: Resource[]) => void;
}

function StylesheetSubResources(props: Props) {
	const [expanded, setExpanded] = useState(false);

	const renderSubResource = (resource: Resource, key: string) => (
		<div className="stylesheet-item" key={key}>
			{props.title == ResourceName.images && renderImage(resource.url, props.onClickDownload)}
			{props.title == ResourceName.fonts && renderFont(resource.url, props.onClickDownload)}
		</div>
	)

    return (
		<div className={`category ${props.title}`}>
			<div className="sub-parent button-wrap">
				<ExpandButton 
					expanded={expanded} 
					onClickExpand={() => setExpanded(!expanded)}
				/><span className="text">
					{props.title}
				</span>
				<button className="btn btn-default" 
					onClick={() => props.onClickDownloadAll(props.subResources)}
				>
					Download {props.title}
				</button>
			</div>
			<ExpandableSection className="stylesheet-item-wrap" expanded={expanded}>
				{props.subResources.map((it, index) => renderSubResource(it, `stylesheet-${props.title}-${index}`))}
			</ExpandableSection>
		</div>
    );
}


export default StylesheetSubResources;
