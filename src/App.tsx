import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './css/style.css';

import ResourceName from './components/resources/resource/ResourceName';
import ResourceContainer from './components/resources/ResourceContainer';
import DownloadDialog from './components/DownloadDialog';
import { Resource, Resources, emptyResources } from './components/resources/resource/Resource';
import download from './actions/download';
import subscribeResources from './actions/subscribe-resources';
import getPageTitle from './actions/get-page-title';
import downloadAll from './actions/download-all';
import zipFileName from './utils/zip-file-name';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0]);
    const [resources, setResources] = useState<Resources>(emptyResources);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        subscribeResources(resources => setResources(resources));
    }, []);

    const onDownloadProgress = (progress: number) => setDownloadProgress(progress);

    const onDownloadAll = async (resources: Resource[]) => {
        setIsDownloading(true);
        setDownloadProgress(0);
        const title = await getPageTitle();
        await downloadAll(resources, zipFileName(title), onDownloadProgress);
        setIsDownloading(false);
    }

    return (
        <div className="container app-wrap">
            <ResourceContainer 
                active={active} 
                tabNames={tabNames} 
                resources={resources} 
                onChangeTab={(name: ResourceName) => setActive(name)} 
                onDownload={download}
                onDownloadAll={onDownloadAll}
                />
            <DownloadDialog visible={isDownloading} progress={downloadProgress} />
        </div>
    );
}

export default App;
