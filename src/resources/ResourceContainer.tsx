import React, { ReactNode } from 'react';

import ResourceName from './resource/ResourceName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';
import ResourceTab from './resource-tab/ResourceTab';
import { Resource, Resources } from './resource/Resource';
import renderResources from './render-resources';
import { pickResources } from '../utils/pick-resources';

interface Props {
    active: ResourceName,
    tabNames: ResourceName[],
    resources: Resources,
    onChangeTab: (name: ResourceName) => void,
    onDownloadAll: (resources: Resource[]) => void
    onDownload: (url: string, fileName: string) => void
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

const renderTab = (props: Props) => {
    const resources = renderResources(props.active, props.resources, props.onDownload, props.onDownloadAll);

    const createDownloadableUrls = () : Resource[] => pickResources(props.active, props.resources);

    if (resources.length > 0) {
        return <ResourceTab 
                name={props.active} 
                items={resources} onDownloadAll={() => props.onDownloadAll(createDownloadableUrls())} 
            />;
    } else {
        return (
            <div className='tab-content panel panel-default'>
                <div className='panel-body'>There are no <b>{props.active.toLowerCase()}</b> available on this page.</div>
            </div>
        );
    }
}

export default ResourceContainer;
