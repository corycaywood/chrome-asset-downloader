import React, { useState, useEffect } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import ResourceName from './resources/resource/ResourceName';
import ResourceContainer from './resources/ResourceContainer';
import { Resources, emptyResources } from './resources/resource/Resource';
import renderResources from './resources/render-resources';
import download from './actions/download';
import getResources from './actions/get-resources';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0])
    const [resources, setResources] = useState<Resources>(emptyResources)

    useEffect(() => {
        getResources().then(res => {
            setResources(res as Resources)
        })
    })

    return (
        <ResourceContainer active={active} tabNames={tabNames} resources={renderResources(active, resources, download)} onChangeTab={(name: ResourceName) => setActive(name)} />
    );
}

export default App;
