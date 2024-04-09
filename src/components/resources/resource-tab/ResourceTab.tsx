import React, { ReactNode } from 'react';

import ResourceName from '../resource/ResourceName'

interface Props extends React.PropsWithChildren {
    name: ResourceName,
    items: ReactNode[],
    onDownloadAll: () => void
}

function ResourceTab(props: Props) {
    return (
        <div className="tab-content panel panel-default">
            <div className="panel-body download-all">
                <button onClick={() => props.onDownloadAll()} className="btn btn-default">Download All {props.name}</button>
            </div>

            {props.items.map(item => renderItem(`${props.name}-item-${props.items.indexOf(item)}`, item))}
        </div>
    );
}

function renderItem(key: string, item: ReactNode) {
    return (
        <div key={key} className="item">
            {item}
        </div>
    );
}
  
export default ResourceTab;
