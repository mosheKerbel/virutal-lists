import React, { useState } from 'react';
import AllCapabilites from './Components/OptimizedWithInfiniteScroll';
import BasicVirtualList from './Components/BasicVirtualList';
import NoVirtaulList from './Components/NoVirtaulList'
import DynamicHeightVirtualList from './Components/DynamicHeightVirtualList'

import './App.css';

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState('LiveDemo');
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'NoVirtaulList':
        return <NoVirtaulList/>;
      case 'BasicVirtualList':
            return <BasicVirtualList/>;
      case 'AllCapabilites':
        return <AllCapabilites/>  
      case 'DynamicHeightVirtualList':
        return <DynamicHeightVirtualList/>
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="menu">
        <ul>
        <li onClick={() => setSelectedComponent('NoVirtaulList')}>No Virtual List</li>
          <li onClick={() => setSelectedComponent('BasicVirtualList')}>Basic Virtual List</li>
          <li onClick={() => setSelectedComponent('DynamicHeightVirtualList')}>Dynamic Height Virtual List</li>
          <li onClick={() => setSelectedComponent('AllCapabilites')}>OptimizedWithInfiniteScroll</li>
          <li onClick={() => setSelectedComponent('LiveDemo')}>Live Demo</li>
        </ul>
      </div>
      <div className="component-container">{renderComponent()}</div>
    </div>
  );
};

export default App;
