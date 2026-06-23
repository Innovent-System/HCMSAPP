import { useRef, useState } from 'react';
import { Box, Typography, Stack, Input } from '../../deps/ui';
import { FilePresent, CloudUpload } from '../../deps/ui/icons';

/**
 * @param {import('@mui/material').InputProps} props 
 * @returns {JSX.Element}
 */

const FileDrop = (props) => {
    const { name, label, value = null, error = null, onChange } = props;
    const fileInputRef = useRef();
    const [isDragOver, setIsDragOver] = useState(false);

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files[0]) onChange(convertToDefEventPara(name, e.dataTransfer.files[0]));
    };

    return <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mb={0.75}>
            CV / Resume * <span style={{ fontWeight: 400 }}>(PDF or DOCX, max 5MB)</span>
        </Typography>
        <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            sx={{
                border: '1.5px dashed',
                borderColor: error ? 'error.main' : isDragOver ? 'info.main' : value ? 'success.main' : 'divider',
                borderRadius: 1.5,
                p: 2.5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragOver ? 'action.hover' : 'transparent',
                transition: 'border-color .15s, background .15s',
            }}
        >
            {value ? (
                <Stack alignItems="center" spacing={0.5}>
                    <FilePresent sx={{ fontSize: 28, color: 'success.main' }} />
                    <Typography variant="caption" color="success.main" fontWeight={500}>{value.name}</Typography>
                    <Typography variant="caption" color="text.disabled">Click to change</Typography>
                </Stack>
            ) : (
                <Stack alignItems="center" spacing={0.5}>
                    <CloudUpload sx={{ fontSize: 28, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary">
                        Drag & drop or <span style={{ color: 'var(--mui-palette-info-main, #1976d2)' }}>browse</span>
                    </Typography>
                </Stack>
            )}
            <input
                ref={fileInputRef}
                onClick={function (e) { e.target.value = null }}
                type="file"
                name={name}
                accept=".pdf,.docx"
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files[0]) onChange(convertToDefEventPara(name, e.target.files[0])); }}
            />
        </Box>
        {error && (
            <Typography variant="caption" color="error" mt={0.5} display="block">{error}</Typography>
        )}
    </Box>

}

export default FileDrop;