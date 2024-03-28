import React, { useState, useEffect } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import ResourceName from './resources/resource/ResourceName';
import ResourceContainer from './resources/ResourceContainer';
import DownloadDialog from './DownloadDialog'
import { Resources, emptyResources } from './resources/resource/Resource';
import renderResources from './resources/render-resources';
import download from './actions/download';
import subscribeResources from './actions/subscribe-resources';
import downloadAll from './actions/download-all';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0]);
    const [resources, setResources] = useState<Resources>(emptyResources);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        subscribeResources(resources => setResources(resources))
    }, [])

    const onDownloadProgress = (progress: number) => setDownloadProgress(progress);

    const onDownload = async () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        await downloadAll(active, resources, "file.zip", onDownloadProgress);
        setIsDownloading(false);
    }

    return (
        <div>
            <ResourceContainer 
                active={active} 
                tabNames={tabNames} 
                resources={renderResources(active, resources, download)} 
                onChangeTab={(name: ResourceName) => setActive(name)} 
                onDownloadAll={() => onDownload()}
                />
            <DownloadDialog visible={isDownloading} progress={downloadProgress} />
        </div>
    );
}

export default App;
