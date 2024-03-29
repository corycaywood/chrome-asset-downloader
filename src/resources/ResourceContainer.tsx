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

const renderTab = (props: Props) => {
    if (props.resources.length > 0) {
        return <ResourceTab name={props.active} items={props.resources} onDownloadAll={props.onDownloadAll} />;
    } else {
        return (
            <div className='tab-content panel panel-default'>
                <div className='panel-body'>There are no <b>{props.active.toLowerCase()}</b> available on this page.</div>
            </div>
        );
    }
}

function ResourceContainer(props: Props) {
    return (
        <div className="container app-wrap">
            <ResourceTabButtons names={props.tabNames} active={props.active} onClick={props.onChangeTab}/>

            <div className="row">
                <div className="col-xs-12">
                    {renderTab(props)}
                </div>
            </div>
        </div>
    );
}

export default ResourceContainer;
