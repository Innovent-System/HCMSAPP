import { useRef, useState } from 'react';
import { Box, Typography, Stack, Input } from '../../deps/ui';
import { FilePresent, CloudUpload } from '../../deps/ui/icons';

/**
 * @param {import('@mui/material').InputProps} props 
 * @returns {JSX.Element}
 */

// Imports apne original FileDrop wale hi rakho:
// useRef, useState, Box, Typography, Stack, FilePresent, CloudUpload

const formatSize = (bytes) => {
    if (typeof bytes !== 'number') return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * Generic file picker / drop zone.
 * Value: ek File (ya server ki purani file ke liye { name, size } object), ya null.
 *
 * AutoForm se khud aate hain: name, label, required, value, error, onChange
 * Optional props:
 *  accept    - '.pdf,.docx' jaisa list (khali = koi bhi file); click aur drag-drop dono par check hota hai
 *  maxSize   - bytes mein (default 5MB, 0 = limit nahi)
 *  hint      - heading ke saath wala text; na do to accept + maxSize se khud banta hai, jaise "(PDF, DOCX · max 5 MB)"
 *  clearable - true ho to chuni hui file ke saath "Remove" dikhta hai (value null ho jati hai)
 *
 * CV wali screen mein field config mein ye do props de do:  label: 'CV / Resume', accept: '.pdf,.docx'
 */
const FileDrop = (props) => {
    const {
        name, label, required = false, value = null, error = null, onChange,
        accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
        maxSize = 5 * 1024 * 1024,
        hint,
        clearable = false,
    } = props;
    const fileInputRef = useRef();
    const [isDragOver, setIsDragOver] = useState(false);
    const [localError, setLocalError] = useState(null);

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const acceptList = accept.split(',').map((a) => a.trim().toLowerCase()).filter(Boolean);

    const isAllowed = (file) => {
        if (!acceptList.length) return true;
        const fileName = file.name.toLowerCase();
        return acceptList.some((a) => {
            if (a.startsWith('.')) return fileName.endsWith(a);
            if (a.endsWith('/*')) return file.type.startsWith(a.slice(0, -1));
            return file.type === a;
        });
    };

    const pick = (file) => {
        if (!file) return;
        if (!isAllowed(file)) {
            setLocalError('This file type is not allowed');
            return;
        }
        if (maxSize && file.size > maxSize) {
            setLocalError(`File is larger than ${Math.round(maxSize / 1024 / 1024)} MB`);
            return;
        }
        setLocalError(null);
        onChange(convertToDefEventPara(name, file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        pick(e.dataTransfer.files[0]);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setLocalError(null);
        onChange(convertToDefEventPara(name, null));
    };

    const extensions = acceptList.filter((a) => a.startsWith('.')).map((a) => a.slice(1).toUpperCase());
    const autoHint = [
        extensions.length ? extensions.join(', ') : null,
        maxSize ? `max ${Math.round(maxSize / 1024 / 1024)} MB` : null,
    ].filter(Boolean).join(' · ');
    const shownHint = hint ?? (autoHint ? `(${autoHint})` : '');
    const shownError = error || localError;

    return <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mb={0.75}>
            {label}{required ? ' *' : ''} <span style={{ fontWeight: 400 }}>{shownHint}</span>
        </Typography>
        <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            sx={{
                border: '1.5px dashed',
                borderColor: shownError ? 'error.main' : isDragOver ? 'info.main' : value ? 'success.main' : 'divider',
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
                    <Typography variant="caption" color="success.main" fontWeight={500}>
                        {value.name}{formatSize(value.size) ? ` (${formatSize(value.size)})` : ''}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        Click to change
                        {clearable && (
                            <>
                                {' · '}
                                <span style={{ color: 'var(--mui-palette-error-main, #d32f2f)' }} onClick={handleClear}>Remove</span>
                            </>
                        )}
                    </Typography>
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
                accept={accept || undefined}
                style={{ display: 'none' }}
                onChange={(e) => pick(e.target.files[0])}
            />
        </Box>
        {shownError && (
            <Typography variant="caption" color="error" mt={0.5} display="block">{shownError}</Typography>
        )}
    </Box>

}

export default FileDrop;