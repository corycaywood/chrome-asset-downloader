import React, { ReactNode } from 'react';

import ResourceName from './resource/ResourceName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';
import ResourceTab from './resource-tab/ResourceTab';
import FullRow from '../FullRow';
import { Resource, Resources } from './resource/Resource';
import renderResources from './render-resources';
import { pickResources } from '../../utils/pick-resources';
import { ResourceDownloader } from '../../actions/download';

interface Props {
    active: ResourceName,
    tabNames: ResourceName[],
    resources: Resources,
    onChangeTab: (name: ResourceName) => void,
    onDownloadAll: (resources: Resource[]) => void
    onDownload: ResourceDownloader
}

function ResourceContainer(props: Props) {
    return (
        <>
            <FullRow className="nav-container">
                <button 
                    className="btn btn-danger" 
                    onClick={() => props.onDownloadAll(collectAllResources(props.resources))}
                >
                        Download Everything as ZIP
                </button>
                <ResourceTabButtons names={props.tabNames} active={props.active} onClick={props.onChangeTab}/>
            </FullRow>
            
            <FullRow>
                <p>Files will be downloaded as a <strong>ZIP file</strong>.</p>
            </FullRow>

            <FullRow>
                {renderTab(props)}
            </FullRow>
        </>
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

const collectAllResources = (resources: Resources) => resources.fonts
    .concat(resources.images)
    .concat(resources.scripts)
    .concat(resources.stylesheets);

export default ResourceContainer;
