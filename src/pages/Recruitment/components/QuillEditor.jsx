import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, placeholder }) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const isInit = useRef(false);

    useEffect(() => {
        if (!containerRef.current || quillRef.current || isInit.current) return;

        const quill = new Quill(containerRef.current, {
            theme: 'snow',
            placeholder: placeholder || '',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    ['link', 'clean'],
                ],
            },
        });

        quill.on('text-change', () => {
            onChange?.(quill.root.innerHTML);
        });

        quillRef.current = quill;

        if (value) {
            quill.root.innerHTML = value;
        }
        isInit.current = true;
        return () => {
            quillRef.current = null;
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    // Sync external value
    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value || '';
        }
    }, [value]);

    // Expose insert method
    const insertText = (text) => {
        if (!quillRef.current) return;
        const range = quillRef.current.getSelection(true);
        quillRef.current.insertText(range.index, text, 'user');
        quillRef.current.setSelection(range.index + text.length);
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current._quillInsert = insertText;
        }
    });

    return <div ref={containerRef} style={{ minHeight: 140 }} />;
}

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;