import React, { ReactNode } from 'react';

import ResourceName from './resource/ResourceName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';
import ResourceTab from './resource-tab/ResourceTab';

interface Props {
    active: ResourceName,
    tabNames: ResourceName[],
    resources: ReactNode[],
    onChangeTab: (name: ResourceName) => void,
    onDownloadAll: () => void
}

function ResourceContainer(props: Props) {
    return (
        <div className="container app-wrap">
            <ResourceTabButtons names={props.tabNames} active={props.active} onClick={props.onChangeTab}/>

            <div className="row">
                <div className="col-xs-12">
                    <ResourceTab name={props.active} items={props.resources} onDownloadAll={props.onDownloadAll} />
                </div>
            </div>
        </div>
    );
}

export default ResourceContainer;
