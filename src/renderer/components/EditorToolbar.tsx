import { find, reverse } from "lodash"
import { useCallback, useMemo, useState } from "react"
import { ToolbarHeader, ToolbarActions, Input, ButtonGroup, Button, Select } from 'react-photon'

import './EditorToolbar.css'

const EditorToolbar = ({ load = false, commits = false, onLoad, onStore }) => {
  const [inputValue, setInputValue] = useState('')

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
        <ButtonGroup>
          {load && <Button onClick={handleLoad}>Load</Button>}
          <Button onClick={onStore}>Save</Button>
        </ButtonGroup>
      </ToolbarActions>
    </ToolbarHeader>
  )
}

export default EditorToolbar