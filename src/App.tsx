import React, { useState } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import TabName from './resource/ResourceName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';
import ResourceTab from './resource-tab/ResourceTab';
import { Resources } from './resource/Resource'
import renderResources from './resource/render-resources'

const tabNames = [TabName.stylesheets, TabName.scripts, TabName.images, TabName.fonts];
const resources: Resources = {
    stylesheets: [
        {url: "https://www.example.com/stylesheet.css"}
    ],
    images: [
        {url: "https://www.example.com/image.jpeg"}
    ],
    scripts: [
        {url: "https://www.example.com/script.js"}
    ],
    fonts: [
        {
            url: "https://www.example.com/font.woff",
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
                    <ResourceTab name={active} onDownloadClick={() => undefined} items={renderResources(active, resources, () => undefined)} />
                </div>
            </div>
        </div>
    );
}

export default App;
