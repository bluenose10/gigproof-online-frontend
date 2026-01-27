import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../styles/MergePDFs.css';

const MAX_FILES = 10;

export default function MergePDFs() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    setError('');

    // Filter PDF files only
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length !== newFiles.length) {
      setError('Only PDF files are allowed');
    }

    // Check total count
    if (files.length + pdfFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} PDFs allowed`);
      return;
    }

    // Add file objects with unique IDs
    const filesWithIds = pdfFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: formatFileSize(file.size)
    }));

    setFiles(prev => [...prev, ...filesWithIds]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setError('');
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= files.length) return;

    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setError('');
    setProgress(0);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDFs to merge');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      // Process each PDF
      for (let i = 0; i < totalFiles; i++) {
        const fileData = files[i];
        setProgress(Math.round(((i + 1) / totalFiles) * 100));

        // Read file as array buffer
        const arrayBuffer = await fileData.file.arrayBuffer();

        // Load the PDF
        const pdf = await PDFDocument.load(arrayBuffer);

        // Copy all pages from this PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        // Add each page to merged PDF
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      // Generate merged PDF
      const mergedPdfBytes = await mergedPdf.save();

      // Create download
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);

    } catch (err) {
      console.error('Merge error:', err);
      setError('Failed to merge PDFs. Please ensure all files are valid PDFs.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="merge-pdfs-page">
      <div className="merge-container">
        <header className="merge-header">
          <h1>Merge PDFs (Free Tool)</h1>
          <p>Combine multiple PDF income reports into a single document</p>
          <p className="privacy-note">
            🔒 All processing happens in your browser. No files are uploaded to our servers.
          </p>
        </header>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div
          className={`dropzone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Drag & Drop PDFs Here</h3>
            <p>or click to browse</p>
            <p className="file-limit">Maximum {MAX_FILES} files</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>

        {files.length > 0 && (
          <div className="files-section">
            <div className="files-header">
              <h3>Files to Merge ({files.length}/{MAX_FILES})</h3>
              <button className="btn-text" onClick={clearAll}>
                Clear All
              </button>
            </div>

            <div className="files-list">
              {files.map((file, index) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      className="btn-icon"
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="btn-icon btn-remove"
                      onClick={() => removeFile(file.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="merge-actions">
              <button
                className="btn btn-primary"
                onClick={mergePDFs}
                disabled={isProcessing || files.length < 2}
              >
                {isProcessing ? 'Merging...' : `Merge ${files.length} PDFs`}
              </button>
            </div>

            {isProcessing && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                  {progress}%
                </div>
              </div>
            )}
          </div>
        )}

        <div className="info-section">
          <h3>How It Works</h3>
          <ol>
            <li>Upload or drag 2-{MAX_FILES} PDF files</li>
            <li>Reorder files if needed using ↑ ↓ buttons</li>
            <li>Click "Merge PDFs" to combine them</li>
            <li>Download your merged PDF instantly</li>
          </ol>
          <p className="info-note">
            Perfect for combining multiple income reports for landlords, lenders, or verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
