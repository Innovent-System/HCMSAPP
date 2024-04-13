import React, { useId } from 'react'
import { Tooltip, IconButton, Input } from '../../deps/ui'
import { CloudUpload } from '../../deps/ui/icons'

const FileInput = ({ handleUpload }) => {
    const htmlFor = useId();
    return (
        <Tooltip title="Upload File" placement="top" arrow>
            <label htmlFor={htmlFor}>
                <Input style={{ display: 'none' }} onClick={function (e) { e.target.value = null }} onChange={handleUpload} accept="image/*" id={htmlFor} type="file" />
                <IconButton sx={{ color: "#fff" }} size='small' aria-label="upload file" component="span">
                    <CloudUpload />
                </IconButton>
            </label>
        </Tooltip>
    )
}

export default FileInput