import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent',
    'link'
];

export default function RichTextEditor({ value, onChange, placeholder, className }) {
    // Helper to handle legacy Slate JSON or plain string
    const processValue = (val) => {
        if (!val) return '';

        // 1. Check if it's already a direct object/array (rare but possible)
        let parsed = null;
        if (Array.isArray(val)) {
            parsed = val;
        } else if (typeof val === 'object' && val !== null) {
            parsed = [val];
        }

        // 2. If it's a string, we need to be smart.
        // It might be pure HTML, pure JSON, or accidentally HTML-wrapped JSON (e.g. "<p>[...]</p>")
        if (!parsed && typeof val === 'string') {
            const trimmed = val.trim();

            // Try to detect JSON array inside the string even if wrapped in tags
            // Look for a pattern starting with [ and ending with ] potentially surrounded by tags
            // This regex matches a bracketed block that looks like our data
            const match = trimmed.match(/(\[\s*\{.*\}\s*\])/s);

            if (match) {
                try {
                    const potentialJson = match[1];
                    const decoded = JSON.parse(potentialJson);
                    // Verify it looks like Slate structure (has 'type' or 'children')
                    if (Array.isArray(decoded) && decoded.length > 0 && (decoded[0].type || decoded[0].children)) {
                        parsed = decoded;
                    }
                } catch (e) {
                    // Not valid JSON, ignore
                }
            }

            // If we still haven't parsed it, and it looks like JSON startsWith, try direct parse
            if (!parsed && trimmed.startsWith('[')) {
                try {
                    parsed = JSON.parse(trimmed);
                } catch (e) { }
            }
        }

        // 3. If we successfully parsed a Slate structure, convert to HTML
        if (Array.isArray(parsed)) {
            return parsed.map(node => {
                if (node.type === 'paragraph' && Array.isArray(node.children)) {
                    const innerHtml = node.children.map(c => {
                        let text = c.text || '';
                        if (c.bold) text = `<strong>${text}</strong>`;
                        if (c.italic) text = `<em>${text}</em>`;
                        return text;
                    }).join('');
                    return `<p>${innerHtml}</p>`;
                }
                if (Array.isArray(node.children)) {
                    return `<p>${node.children.map(c => c.text || '').join('')}</p>`;
                }
                if (node.text) return `<p>${node.text}</p>`;
                return '';
            }).join('');
        }

        // 4. Fallback: Return original string (assumed HTML)
        return val;
    };

    return (
        <div className={className}>
            <ReactQuill
                theme="snow"
                value={processValue(value)}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
