import React, { ReactNode } from 'react';

import TabName from '../resource/ResourceName'

interface Props extends React.PropsWithChildren {
    name: TabName,
    items: ReactNode[]
    onDownloadClick: () => void
}

function ResourceTab(props: Props) {
    return (
        <div className="tab-content panel panel-default">
            <div className="panel-body download-all">
                <button className="btn btn-danger">Download All {props.name}</button>
            </div>

            {props.items.map(item => renderItem(item))}
        </div>
    );
}

function renderItem(item: ReactNode) {
    return (
        <div className="item">
            <div className="panel-heading stylesheet-item">
                <div className="button-wrap">
                    {item}
                </div>
            </div>
        </div>
    );
}
  
export default ResourceTab;
