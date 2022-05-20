import { find, get, noop } from 'lodash'
import { useCallback, useContext, useState } from 'react'
import { FormGroup, Input, Select, Button } from 'react-photon'
import { CeramicContext } from '../context/CeramicContext'

import './Connect.css'

const nodes = [
  { value: 'https://ceramic.gooddollar.org', label: 'GoodDollar Ceramic [mainnet]' },
  { value: 'https://ceramic-clay.3boxlabs.com', label: 'JS Ceramic Clay [testnet]' },
]

const Connect = () => {
  const [seed, setSeed] = useState('')
  const [node, setNode] = useState(() => get(nodes, '[0].value'))
  const [connecting, setConnecting] = useState(false)
  const { connect } = useContext(CeramicContext)

  const updateNode = useCallback(({ nativeEvent }) => {
    const { options } = nativeEvent.srcElement
    const selected = find(options, { selected: true })

    if (selected) {
      setNode(selected.value)
    }
  }, [setNode])

  const updateSeed = useCallback(({ nativeEvent }) => {
    const { value } = nativeEvent.srcElement

    setSeed(value)
  }, [setSeed])

  const onConnect = useCallback(async () => {
    setConnecting(true)

    try {
      await connect(node, seed)
    } finally {
      setConnecting(false)
    }
  }, [node, seed])

  return (
    <div className="connect-wrapper">
      <form className="connect">
        <FormGroup>
          <label>Ceramic Node:</label>
          <Select items={nodes} onInput={updateNode} />
        </FormGroup>
        <FormGroup>
          <label>Ceramic DID seed:</label>
          <Input type="password" placeholder="32-bit hex seed value" value={seed} onChange={updateSeed} />
        </FormGroup>
        <FormGroup>
          <Button
            type="button"
            theme={connecting ? "default" : "primary"}
            onClick={connecting ? noop : onConnect}
            active={!connecting}
          >
            {connecting ? 'Connecting...' : 'Connect'}
          </Button>
        </FormGroup>
      </form>
    </div>
  )
}

export default Connect
