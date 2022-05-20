import { useContext } from 'react';
import { Window, WindowContent, ToolbarFooter, Button, Icon } from 'react-photon'

import CeramicProvider, { CeramicContext } from './context/CeramicContext';
import Connect from './screens/Connect';
import Inspector from './screens/Inspector';

// styles
import '@feizheng/photon'
import './App.css'

const AppUI = () => {
  const { connected } = useContext(CeramicContext)

  return connected ? <Inspector /> : <Connect />
}

const AppStatus = () => {
  const { connected, node, disconnect } = useContext(CeramicContext)

  return <ToolbarFooter>
    &nbsp;&nbsp;&nbsp;
    {connected ? (
      <>
        {'Connected to ' + node}
        &nbsp;&nbsp;&nbsp;
        <Button size="mini" onClick={disconnect}>
          <Icon value="cancel-circled" />
          &nbsp;Disconnect
        </Button>
      </>
    ) : 'Disconnected'}
  </ToolbarFooter>
}

const App = () => (
  <Window relative className="app-container">
    <WindowContent>
      <AppUI />
    </WindowContent>
    <AppStatus />
  </Window>
)

export default () => (
  <CeramicProvider>
    <App />
  </CeramicProvider>
)
