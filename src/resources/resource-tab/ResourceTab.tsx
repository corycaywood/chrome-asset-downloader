import React, { ReactNode } from 'react';

import ResourceName from '../resource/ResourceName'
import DownloadableUrl from '../../DownloadableUrl';

interface Props extends React.PropsWithChildren {
    name: ResourceName,
    items: ReactNode[],
    onDownloadAll: () => void
}

function ResourceTab(props: Props) {
    return (
        <div className="tab-content panel panel-default">
            <div className="panel-body download-all">
                <button onClick={() => props.onDownloadAll()} className="btn btn-danger">Download All {props.name} as a ZIP file</button>
            </div>

            {props.items.map(item => renderItem(`${props.name}-item-${props.items.indexOf(item)}`, item))}
        </div>
    );
}

function renderItem(key: string, item: ReactNode) {
    return (
        <div key={key} className="item">
            <div className="panel-heading">
                <div className="button-wrap">
                    {item}
                </div>
            </div>
        </div>
    );
}
  
export default ResourceTab;
