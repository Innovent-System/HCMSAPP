import React, { useId } from 'react'
import { Tooltip, IconButton, Input, Link } from '../../deps/ui'
import { CloudUpload } from '../../deps/ui/icons'

const FileInput = ({ handleUpload, text, sx, ...others }) => {
    const htmlFor = useId();
    return (
        <Tooltip sx={sx} title="Upload File" placement="top" arrow>
            <label htmlFor={htmlFor}>
                <Input style={{ display: 'none' }} onClick={function (e) { e.target.value = null }} onChange={handleUpload} accept="excel/*" id={htmlFor} type="file" />
                {text ? <Link>{text}</Link> :
                    <IconButton size='small' aria-label="upload file" component="span" {...others}>
                        <CloudUpload />
                    </IconButton>
                }
            </label>
        </Tooltip>
    )
}

export default FileInput