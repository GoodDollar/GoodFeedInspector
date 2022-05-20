import { createContext, useCallback, useState } from "react";
import { bootstrapCeramic } from "renderer/ceramic/bootstrap";

export const CeramicContext = createContext({
  Post: null,
  node: null,
  ceramic: null,
  connected: false,
  authenticated: false,
  async connect() {},
  disconnect() {}
})

const CeramicProvider = ({ children }) => {
  const [node, setNode] = useState(null)
  const [Post, setPostModel] = useState(null)
  const [ceramic, setCeramic] = useState(null)
  const [connected, setConnected] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  const connect = useCallback(async (ceramicNodeURL: string, ceramicDIDSeed: string) => {
    const { ceramic, Post } = await bootstrapCeramic(ceramicNodeURL, ceramicDIDSeed)

    setNode(ceramicNodeURL)
    setConnected(true)
    setAuthenticated(!!ceramicDIDSeed)
    setCeramic(ceramic)
    setPostModel(() => Post)
  }, [setConnected, setAuthenticated, setCeramic, setPostModel, setNode])

  const disconnect = useCallback(() => {
    setNode(null)
    setCeramic(null)
    setPostModel(null)
    setConnected(false)
    setAuthenticated(false)
  }, [setConnected, setAuthenticated, setCeramic, setPostModel, setNode])

  const contextValue = {
    Post,
    node,
    ceramic,
    connected,
    authenticated,
    connect,
    disconnect,
  }

  return (
    <CeramicContext.Provider value={contextValue}>
      {children}
    </CeramicContext.Provider>
  )
}

export default CeramicProvider
