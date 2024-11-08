import React, { useState, useEffect, useRef } from 'react';

/* eslint-disable import/first */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: true,
  headerIds: false,
  langPrefix: 'language-',
  xhtml: false,
  mangle: false,
  taskLists: true,
  highlight: function (code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

import { saveAs } from 'file-saver';
import SplitPane from 'react-split-pane';

const App = () => {
  const [markdownText, setMarkdownText] = useState(`# Welcome to Mento, the markdown editor

This is a simple markdown editor with a live preview.

## Features

- Edit markdown on the left side.
- Preview your formatted content on the right side.
- Scroll synchronization between editor and preview.
- Save your content as a \`.md\` file.

### Sample Content

- **Bold text**
- *Italic text*
- [Link to Google](https://www.google.com)
- Inline code: \`const x = 10;\`

\`\`\`javascript
// Code block example
function greet() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote.

- [ ] Task 1
- [x] Task 2

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Happy writing!`);

  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  }, [markdownText]);

  const handleSave = () => {
    if (markdownText.trim() !== '') {
      const filename = prompt('Enter the filename for your markdown file:', 'document.md');
      if (filename) {
        const blob = new Blob([markdownText], { type: 'text/markdown' });
        saveAs(blob, filename);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText).then(() => {
      alert('Markdown content copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleTextChange = (e) => {
    setMarkdownText(e.target.value);
  };

  const handleEditorClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const syncScroll = (e) => {
    if (textareaRef.current && previewRef.current) {
      const scrollPercentage = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
      previewRef.current.scrollTop = scrollPercentage * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    }
  };

  const syncScrollReverse = (e) => {
    if (textareaRef.current && previewRef.current) {
      const scrollPercentage = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
      textareaRef.current.scrollTop = scrollPercentage * (textareaRef.current.scrollHeight - textareaRef.current.clientHeight);
    }
  };

  return (
    <div className="container mt-5" style={{ height: '100vh' }}>
      <div className="d-flex align-items-center mb-3">
        <img src={require('./logo.png')} alt="Mento Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
        <h1>Mento</h1>
      </div>
      <div className="mb-3 d-flex justify-content-end">
        <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
        <button className="btn btn-secondary" onClick={handleCopy}>Copy</button>
      </div>
      <SplitPane split="vertical" minSize={200} resizerStyle={{ width: '10px', background: '#ccc', cursor: 'col-resize' }} defaultSize={localStorage.getItem('splitPos') ? parseInt(localStorage.getItem('splitPos')) : '50%'} onDragFinished={(size) => localStorage.setItem('splitPos', size)}>
        <div className="editor-area p-3" style={{ overflow: 'auto', borderRight: '2px solid #ccc', height: '100%' }} onClick={handleEditorClick} onScroll={syncScroll}>
          <textarea
            ref={textareaRef}
            className="form-control no-highlight custom-textarea"
            value={markdownText}
            onChange={handleTextChange}
            placeholder="Start typing..."
            style={{ height: '100%', width: '100%', resize: 'none', overflow: 'auto', paddingBottom: '20px', flexGrow: 1 }}
            autoFocus
          ></textarea>
        </div>
        <div ref={previewRef} className="preview-area p-3" style={{ overflow: 'auto', height: '100%', minHeight: '100%' }} onScroll={syncScrollReverse}>
          <div
            className="markdown-preview"
            style={{ height: '100%', cursor: 'text' }}
            dangerouslySetInnerHTML={{ __html: marked(markdownText) }}
          ></div>
        </div>
      </SplitPane>
    </div>
  );
};

export default App;
