import React, { useState, useEffect } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import ResourceName from './resources/resource/ResourceName';
import ResourceContainer from './resources/ResourceContainer';
import { Resources, emptyResources } from './resources/resource/Resource';
import renderResources from './resources/render-resources';
import download from './actions/download';
import subscribeResources from './actions/subscribe-resources';
import downloadAll from './actions/download-all';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0])
    const [resources, setResources] = useState<Resources>(emptyResources)

    useEffect(() => {
        subscribeResources(resources => setResources(resources))
    }, [])

    return (
        <ResourceContainer 
            active={active} 
            tabNames={tabNames} 
            resources={renderResources(active, resources, download)} 
            onChangeTab={(name: ResourceName) => setActive(name)} 
            onDownloadAll={() => downloadAll(active, resources, "file.zip")}
            />
    );
}

export default App;
