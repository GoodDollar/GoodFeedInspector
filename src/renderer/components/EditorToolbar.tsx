import { find, noop, reverse } from "lodash"
import { useCallback, useContext, useMemo, useState } from "react"
import { ToolbarHeader, ToolbarActions, Input, ButtonGroup, Button, Select } from 'react-photon'
import { CeramicContext } from "../context/CeramicContext"

import './EditorToolbar.css'

const EditorToolbar = ({ load = false, commits = false, onLoad, onStore }) => {
  const [inputValue, setInputValue] = useState('')
  const [storing, setStoring] = useState(false)
  const { authenticated } = useContext(CeramicContext)

  const options = useMemo(() => {
    if (!commits) {
      return []
    }

    return reverse(commits).map(id => ({ label: id, value: id }))
  }, [commits])

  const updateInputValue = useCallback(({ nativeEvent }) => {
    const { value } = nativeEvent.srcElement

    setInputValue(value)
  }, [setInputValue])

  const handleCommitSelect = useCallback(({ nativeEvent }) => {
    const { options } = nativeEvent.srcElement
    const selected = find(options, { selected: true })

    if (selected) {
      onLoad(selected.value)
    }
  }, [onLoad])

  const handleLoad = useCallback(() => {
    onLoad(inputValue)
  }, [onLoad, inputValue])

  const handleStore = useCallback(async () => {
    setStoring(true)
    await onStore().finally(() => setStoring(false))
  }, [onStore, setStoring])

  return (
    <ToolbarHeader className="editor-toolbar">
      <ToolbarActions>
        {load && (
          <Input
            placeholder="Document ID"
            className="btn-mini"
            value={inputValue}
            onChange={updateInputValue}
          />
        )}
        {commits && (
          <Select
            className="btn-mini"
            items={options}
            onInput={handleCommitSelect}
          />
        )}
        {(load || authenticated) && (
          <ButtonGroup>
            {load && <Button onClick={handleLoad}>Load</Button>}
            {authenticated && (
              <Button
                type="button"
                onClick={storing ? noop : handleStore}
              >
                {storing ? 'Saving...' : 'Save'}
              </Button>
            )}
          </ButtonGroup>
        )}
      </ToolbarActions>
    </ToolbarHeader>
  )
}

export default EditorToolbar