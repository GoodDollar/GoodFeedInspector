import { invokeMap, isPlainObject } from "lodash"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Textarea } from 'react-photon'

import EditorToolbar from "./EditorToolbar"
import { CeramicContext } from "../context/CeramicContext"

import './DocumentEditor.css'

const DocumentEditor = ({ id, showCommits = false }) => {
  const { Post } = useContext(CeramicContext)
  const [documentId, setDocumentId] = useState(id)
  const [document, setDocument] = useState(null)
  const [content, setContent] = useState(null)
  const [commits, setCommits] = useState(false)

  const updateContent = useCallback(({ nativeEvent }) => {
    const { value } = nativeEvent.srcElement

    setContent(value)
  }, [setContent])

  const handleStore = useCallback(() => {
    let updated

    try {
      updated = JSON.parse(content)

      if (!isPlainObject(updated)) {
        throw new Error('Invalid JSON')
      }
    } catch {
      return
    }

    Post.store(document, updated)
  }, [document, content, Post])

  useEffect(() => {
    setDocumentId(id)
  }, [id, setDocumentId])

  useEffect(() => {
    if (!documentId) {
      return
    }

    Post.load(documentId).then(setDocument)
  }, [documentId, Post])

  useEffect(() => {
    if (!document) {
      return
    }

    setContent(JSON.stringify(document.content, null, 2))
  }, [setContent, document])

  useEffect(() => {
    if (!document || !showCommits || !id) {
      setCommits(false)
      return
    }

    if (documentId !== document.id.toString()) {
      return
    }

    setCommits(invokeMap(document.allCommitIds, 'toString'))
  }, [document, showCommits, id, documentId, setCommits])

  return (
    <>
      <EditorToolbar
        load={!id}
        commits={commits}
        onLoad={setDocumentId}
        onStore={handleStore}
      />
      {document && (
        <Textarea
          value={content}
          className="editor"
          onChange={updateContent}
        />
      )}
    </>
  )
}

export default DocumentEditor