import React, { useState, useEffect } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import ResourceName from './resources/resource/ResourceName';
import ResourceContainer from './resources/ResourceContainer';
import { Resources, emptyResources } from './resources/resource/Resource';
import renderResource from './resources/render-resource';
import download from './actions/download';
import getResources from './actions/get-resources';

const tabNames = [ResourceName.stylesheets, ResourceName.scripts, ResourceName.images, ResourceName.fonts];
// const resources: Resources = {
//     stylesheets: [
//         {url: "https://getbootstrap.com/docs/5.3/dist/css/bootstrap.min.css"}
//     ],
//     images: [
//         {url: "https://i.stack.imgur.com/FdTlD.jpg?s=64&g=1"}
//     ],
//     scripts: [
//         {url: "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"}
//     ],
//     fonts: [
//         {url: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2"}
//     ]
// }

function App() {
    const [active, setActive] = useState<ResourceName>(tabNames[0])
    const [resources, setResources] = useState<Resources>(emptyResources)

    useEffect(() => {
        getResources().then(res => {
            console.log(res)
            setResources(res as Resources)
        })
    })


    return (
        <ResourceContainer active={active} tabNames={tabNames} resources={renderResource(active, resources, download)} onChangeTab={(name: ResourceName) => setActive(name)} />
    );
}

export default App;
