import { useContext, useEffect, useState } from 'react'
import { Tabs, TabItem } from 'react-photon'
import DocumentEditor from '../components/DocumentEditor'

import { CeramicContext } from '../context/CeramicContext'

import './Inspector.css'

const Inspector = () => {
  const [indexes, setIndexes] = useState(null)
  const { Post, authenticated } = useContext(CeramicContext)

  useEffect(() => {
    const loadIndexes = async () => {
      const index = await Post.getIndex()
      const changeLog = await Post.getLiveIndex()

      return {
        indexId: index.id.toString(),
        changeLogId: changeLog.id.toString(),
      }
    }

    if (authenticated) {
      loadIndexes().then(setIndexes)
    }
  }, [setIndexes, Post, authenticated])

  return (
    <Tabs value="0" className="inspector">
      {indexes ? [
        <TabItem title="Primary index">
          <DocumentEditor id={indexes.indexId} />
        </TabItem>,
        <TabItem title="Changelog">
          <DocumentEditor id={indexes.changeLogId} showCommits />
        </TabItem>,
      ] : authenticated ? (
        <TabItem title="Loading indexes..." />
      ) : []}
      <TabItem title="Document editor">
        <DocumentEditor />
      </TabItem>
    </Tabs>
  )
}

export default Inspector
