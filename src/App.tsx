import React, { useState } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import TabName from './resource/ResourceName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';
import ResourceTab from './resource-tab/ResourceTab';
import { Resources } from './resource/Resource'
import renderResources from './resource/render-resources'
import download from './actions/download'

const tabNames = [TabName.stylesheets, TabName.scripts, TabName.images, TabName.fonts];
const resources: Resources = {
    stylesheets: [
        {url: "https://getbootstrap.com/docs/5.3/dist/css/bootstrap.min.css"}
    ],
    images: [
        {url: "https://i.stack.imgur.com/FdTlD.jpg?s=64&g=1"}
    ],
    scripts: [
        {url: "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"}
    ],
    fonts: [
        {
            url: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2",
            dataUri: ""
        }
    ]
}

function App() {
    const [active, setActive] = useState<TabName>(tabNames[0])

    return (
        <div className="container app-wrap">
            <ResourceTabButtons names={tabNames} active={active} onClick={(name) => setActive(name)}/>

            <div className="row">
                <div className="col-xs-12">
                    <ResourceTab name={active} onDownloadClick={() => undefined} items={renderResources(active, resources, download)} />
                </div>
            </div>
        </div>
    );
}

export default App;
