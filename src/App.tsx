import React, { useState } from 'react';
import './css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";

import TabName from './resource-tab-buttons/TabName';
import ResourceTabButtons from './resource-tab-buttons/ResourceTabButtons';

const tabNames: TabName[] = ["Stylesheets", "Scripts", "Images", "Fonts"];

function App() {
  const [active, setActive] = useState<TabName>(tabNames[0])

  return (
    <div className="container app-wrap">
      <ResourceTabButtons names={tabNames} activeName={active} onClick={(name) => setActive(name)}/>
    </div>
  );
}

export default App;
