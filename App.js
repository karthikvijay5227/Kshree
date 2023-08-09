import React from 'react';
import { NetworkProvider } from './NetworkContext';
import NetworkAwareApp from './NetworkAwareApp';

class App extends React.Component {
  render() {
    return (
      <NetworkProvider>
        <NetworkAwareApp />
      </NetworkProvider>
    );
  }
}

export default App;
