import { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import '../styles/MergePDFs.css';

const MAX_FILES = 10;

import { useAuth } from '../AuthContext';

export default function MergePDFs() {
  const { user } = useAuth(); // Access logged-in user
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = upload, 2 = form
  const [userName, setUserName] = useState('');
  const [incomePeriod, setIncomePeriod] = useState('');
  const [platformAmounts, setPlatformAmounts] = useState([]);
  const fileInputRef = useRef(null);

  // Set default name from user profile once on load
  useEffect(() => {
    if (user && user.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }, [user]);

  // Configure PDF.js worker using Vite-bundled worker URL
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
  }, []);

  // Extract platform name from filename (fallback only)
  const extractPlatformName = (filename) => {
    const nameWithoutExt = filename.replace(/\.pdf$/i, '');
    // Common patterns
    const patterns = [
      { regex: /uber/i, name: 'Uber' },
      { regex: /doordash/i, name: 'DoorDash' },
      { regex: /lyft/i, name: 'Lyft' },
      { regex: /instacart/i, name: 'Instacart' },
      { regex: /grubhub/i, name: 'Grubhub' },
      { regex: /postmates/i, name: 'Postmates' },
      { regex: /amazon\s*flex/i, name: 'Amazon Flex' },
      { regex: /shipt/i, name: 'Shipt' },
      { regex: /spark/i, name: 'Spark' },
      { regex: /gopuff/i, name: 'GoPuff' },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(nameWithoutExt)) {
        return pattern.name;
      }
    }

    // Clean up filename and capitalize
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .substring(0, 30);
  };

  // Extract text content from PDF using PDF.js (proper text extraction)
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Load document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      // Extract text from first 3 pages max
      const numPages = Math.min(pdf.numPages, 3);
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (err) {
      console.error('Error extracting text from PDF:', err);
      // Return empty string to allow fallback to filename extraction
      return '';
    }
  };

  // Extract platform name from PDF content (reads actual PDF text)
  const extractPlatformFromPDF = (text) => {
    if (!text) return null;

    // Look for "Platform" field in GigProof PDFs
    const platformPatterns = [
      /Platform\s*:?\s*([A-Z][a-zA-Z\s]+?)(?:\s*\(|$|\n)/i,
      /Platform\s+([A-Z][a-zA-Z\s]+?)(?:\s*\(|Test|$|\n)/i,
    ];

    for (const pattern of platformPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let platform = match[1].trim();
        // Clean up (remove "Test" suffix, extra spaces, etc.)
        platform = platform.replace(/\s*\(?\s*Test\s*\)?/i, '').trim();
        if (platform.length >= 3 && platform.length <= 30) {
          return platform;
        }
      }
    }

    return null;
  };

  // Extract dollar amounts from PDF text
  const extractAmountFromPDF = (text) => {
    try {
      // Find all dollar amounts in the text
      const dollarRegex = /\$[\d,]+\.\d{2}/g;
      const matches = text.match(dollarRegex) || [];

      if (matches.length > 0) {
        // Parse all amounts and find the largest
        const amounts = matches.map(match => {
          const numStr = match.replace(/[$,]/g, '');
          return parseFloat(numStr);
        }).filter(num => !isNaN(num) && num > 0);

        if (amounts.length > 0) {
          const maxAmount = Math.max(...amounts);
          // Sanity check - if amount seems too high (over $100k), might be noise
          if (maxAmount < 100000) {
            return maxAmount;
          }
        }
      }

      return 0;
    } catch (err) {
      console.error('Error extracting amount:', err);
      return 0;
    }
  };

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
    setStep(1);
    setUserName('');
    setIncomePeriod('');
    setPlatformAmounts([]);
  };

  // Proceed to Step 2: Extract amounts and platform names from PDFs
  const proceedToForm = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDFs to merge');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress(0);

    try {
      const amounts = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 1) / files.length) * 100));

        const fileData = files[i];

        // Extract text from PDF using PDF.js
        const pdfText = await extractTextFromPDF(fileData.file);

        // 1. Extract Platform Name
        let platformName = extractPlatformFromPDF(pdfText);
        if (!platformName) {
          platformName = extractPlatformName(fileData.name);
        }

        // 2. Extract Amount (largest dollar figure found)
        const extractedAmount = extractAmountFromPDF(pdfText);

        amounts.push({
          id: fileData.id,
          platform: platformName,
          amount: extractedAmount,
          filename: fileData.name
        });
      }

      setPlatformAmounts(amounts);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error processing PDFs:', err);
      setError('Error processing PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // Update individual amount
  const updateAmount = (id, newAmount) => {
    setPlatformAmounts(prev => prev.map(item =>
      item.id === id ? { ...item, amount: parseFloat(newAmount) || 0 } : item
    ));
  };

  // Update platform name
  const updatePlatformName = (id, newName) => {
    setPlatformAmounts(prev => prev.map(item =>
      item.id === id ? { ...item, platform: newName } : item
    ));
  };

  // Calculate total
  const calculateTotal = () => {
    return platformAmounts.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  // Load logo as base64 data URL for embedding in PDF
  const loadLogoAsDataUrl = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = '/images/logo.png';
    });
  };

  // Generate cover page PDF using jsPDF
  const generateCoverPage = async (totalPageCount) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);

    // Premium color palette
    const teal = [15, 118, 110];       // #0f766e
    const tealDark = [13, 94, 88];     // #0d5e58
    const tealLight = [204, 251, 241]; // #ccfbf1
    const navy = [15, 23, 42];         // #0f172a
    const slate = [51, 65, 85];        // #334155
    const mutedText = [100, 116, 139]; // #64748b
    const lightBg = [248, 250, 252];   // #f8fafc
    const borderGray = [226, 232, 240];// #e2e8f0
    const white = [255, 255, 255];

    let yPos = 0;

    // === PREMIUM HEADER BAR ===
    // Full-width teal gradient header band
    const headerHeight = 100;
    doc.setFillColor(...teal);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Darker accent stripe at top (2px)
    doc.setFillColor(8, 80, 74);
    doc.rect(0, 0, pageWidth, 3, 'F');

    // Load and place logo
    const logoDataUrl = await loadLogoAsDataUrl();
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', margin, 20, 60, 60);
    }

    // Header text on teal background
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...white);
    const titleX = logoDataUrl ? margin + 75 : margin;
    doc.text('INCOME SUMMARY', titleX, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(204, 251, 241); // teal-100
    doc.text('Multi-Platform Earnings Summary', titleX, 66);

    // GigProof branding aligned right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.text('GigProof.online', pageWidth - margin, 48, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(204, 251, 241);
    doc.text('Income Documentation', pageWidth - margin, 62, { align: 'right' });

    yPos = headerHeight + 25;

    // === REPORT REFERENCE BAR ===
    const refBarHeight = 28;
    doc.setFillColor(...lightBg);
    doc.rect(margin, yPos, contentWidth, refBarHeight, 'F');
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, refBarHeight, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    const refCode = `GIG-${Date.now().toString(36).toUpperCase()}`;
    doc.text(`Report Ref: ${refCode}`, margin + 10, yPos + 17);

    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.text(`Generated: ${dateStr}`, pageWidth - margin - 10, yPos + 17, { align: 'right' });

    yPos += refBarHeight + 25;

    // === APPLICANT DETAILS CARD ===
    const cardPadding = 15;
    const detailsCardHeight = 75;

    // Card with subtle border and left accent
    doc.setFillColor(...white);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.75);
    doc.rect(margin, yPos, contentWidth, detailsCardHeight, 'FD');

    // Left accent bar
    doc.setFillColor(...teal);
    doc.rect(margin, yPos, 4, detailsCardHeight, 'F');

    // Section label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...teal);
    doc.text('APPLICANT INFORMATION', margin + cardPadding + 5, yPos + 18);

    // Thin divider under label
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.line(margin + cardPadding + 5, yPos + 24, margin + contentWidth - cardPadding, yPos + 24);

    // Name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text('Full Name', margin + cardPadding + 5, yPos + 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(userName, margin + cardPadding + 5, yPos + 56);

    // Period (right column)
    const rightCol = pageWidth / 2 + 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text('Income Period', rightCol, yPos + 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(incomePeriod, rightCol, yPos + 56);

    yPos += detailsCardHeight + 20;

    // === TOTAL EARNINGS HIGHLIGHT BOX ===
    const total = calculateTotal();
    const totalBoxHeight = 80;

    // Teal background with rounded feel (using filled rect)
    doc.setFillColor(...teal);
    doc.rect(margin, yPos, contentWidth, totalBoxHeight, 'F');

    // Inner lighter box for the amount
    const innerMargin = 3;
    doc.setFillColor(13, 104, 97); // slightly darker teal
    doc.rect(margin + innerMargin, yPos + innerMargin, contentWidth - innerMargin * 2, totalBoxHeight - innerMargin * 2, 'F');

    // "Total Earnings" label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(180, 230, 225);
    doc.text('TOTAL COMBINED EARNINGS', pageWidth / 2, yPos + 25, { align: 'center' });

    // Big dollar amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(38);
    doc.setTextColor(...white);
    doc.text(
      `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      pageWidth / 2, yPos + 60, { align: 'center' }
    );

    yPos += totalBoxHeight + 25;

    // === PLATFORM BREAKDOWN TABLE ===
    // Table header
    const tableHeaderHeight = 28;
    doc.setFillColor(...navy);
    doc.rect(margin, yPos, contentWidth, tableHeaderHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text('PLATFORM', margin + 12, yPos + 18);
    doc.text('EARNINGS', pageWidth - margin - 12, yPos + 18, { align: 'right' });

    yPos += tableHeaderHeight;

    // Table rows
    const rowHeight = 30;
    platformAmounts.forEach((item, index) => {
      const rowY = yPos;

      // Alternating row backgrounds
      if (index % 2 === 0) {
        doc.setFillColor(...white);
      } else {
        doc.setFillColor(...lightBg);
      }
      doc.rect(margin, rowY, contentWidth, rowHeight, 'F');

      // Row border
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.25);
      doc.line(margin, rowY + rowHeight, margin + contentWidth, rowY + rowHeight);

      // Platform name with bullet
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...slate);
      doc.text(item.platform, margin + 12, rowY + 19);

      // Amount
      const amountText = `$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...navy);
      doc.text(amountText, pageWidth - margin - 12, rowY + 19, { align: 'right' });

      // Percentage
      const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0.0';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...mutedText);
      doc.text(`${pct}%`, pageWidth - margin - 75, rowY + 19, { align: 'right' });

      yPos += rowHeight;
    });

    // Table total footer
    const totalRowHeight = 34;
    doc.setFillColor(240, 253, 250); // teal-50
    doc.rect(margin, yPos, contentWidth, totalRowHeight, 'F');
    doc.setDrawColor(...teal);
    doc.setLineWidth(1.5);
    doc.line(margin, yPos, margin + contentWidth, yPos);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...teal);
    doc.text('TOTAL', margin + 12, yPos + 22);

    const totalText = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...tealDark);
    doc.text(totalText, pageWidth - margin - 12, yPos + 22, { align: 'right' });

    // Close table border
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos - (platformAmounts.length * rowHeight) - tableHeaderHeight, contentWidth, tableHeaderHeight + (platformAmounts.length * rowHeight) + totalRowHeight, 'S');

    yPos += totalRowHeight + 30;

    // === LEGAL NOTICE ===
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    const legalText = 'Data Source: Income summary compiled from earnings data visible on gig platform dashboards. Supporting earnings documentation is attached.';
    const splitLegal = doc.splitTextToSize(legalText, contentWidth - 20);
    doc.text(splitLegal, margin + 10, yPos);

    // === FOOTER ===
    const footerY = pageHeight - 45;

    // Footer divider line
    doc.setDrawColor(...teal);
    doc.setLineWidth(1);
    doc.line(margin, footerY - 15, pageWidth - margin, footerY - 15);

    // Footer left: page count info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(`Page 1 of ${totalPageCount}  |  Supporting documentation: Pages 2\u2013${totalPageCount}`, margin, footerY);

    // Footer right: branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...teal);
    doc.text('GigProof.online', pageWidth - margin, footerY, { align: 'right' });

    // Bottom accent line
    doc.setFillColor(...teal);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

    // Return as ArrayBuffer
    return doc.output('arraybuffer');
  };

  // Main merge function with cover page
  const generateReport = async () => {
    if (!userName || userName.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    if (!incomePeriod || incomePeriod.trim().length < 2) {
      setError('Please enter the income period');
      return;
    }

    // Check that at least one amount is positive
    const hasPositiveAmount = platformAmounts.some(item => item.amount > 0);
    if (!hasPositiveAmount) {
      setError('Please enter at least one income amount');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      // Step 1: Count actual pages across all uploaded PDFs
      setProgress(5);
      let uploadedPageCount = 0;
      const loadedPdfs = [];
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        uploadedPageCount += pdf.getPageCount();
        loadedPdfs.push(pdf);
      }
      const totalPageCount = 1 + uploadedPageCount; // 1 cover page + all uploaded pages

      // Step 2: Generate cover page with accurate page count
      setProgress(10);
      const coverPageBytes = await generateCoverPage(totalPageCount);
      const coverPdf = await PDFDocument.load(coverPageBytes);

      // Step 3: Create merged PDF starting with cover page
      const mergedPdf = await PDFDocument.create();

      const [coverPage] = await mergedPdf.copyPages(coverPdf, [0]);
      mergedPdf.addPage(coverPage);

      setProgress(20);

      // Step 4: Add all uploaded PDFs
      for (let i = 0; i < loadedPdfs.length; i++) {
        setProgress(20 + Math.round(((i + 1) / loadedPdfs.length) * 70));

        const pdf = loadedPdfs[i];
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      setProgress(95);

      // Step 4: Generate and download
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'income-summary-combined.pdf';
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
      setError('Failed to generate report. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const goBackToUpload = () => {
    setStep(1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <p>Combine multiple PDF income reports into a single document with a professional cover page</p>
          <p className="privacy-note">
            🔒 All processing happens in your browser. No files are uploaded to our servers.
          </p>
        </header>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Upload PDFs</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Review & Generate</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <>
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
                    onClick={proceedToForm}
                    disabled={isProcessing || files.length < 2}
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Review'}
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
          </>
        )}

        {/* Step 2: Form and Review */}
        {step === 2 && (
          <div className="review-section">
            <div className="form-card">
              <h3>Report Details</h3>
              <p className="form-hint">Enter your name and the period covered by your income PDFs.</p>

              <div className="form-group">
                <label htmlFor="userName">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="John Smith"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="incomePeriod">
                  Income Period <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="incomePeriod"
                  value={incomePeriod}
                  onChange={(e) => setIncomePeriod(e.target.value)}
                  placeholder="e.g., November 2025"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-card">
              <h3>Income Breakdown</h3>
              <p className="form-hint">Verify or enter the income amount for each platform.</p>

              <div className="platform-breakdown-header" style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', padding: '0 0.5rem 0.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                <span>Platform found in PDF</span>
                <span style={{ textAlign: 'right' }}>Amount</span>
              </div>

              <div className="amounts-list">
                {platformAmounts.map((item) => (
                  <div key={item.id} className="amount-row">
                    <div className="platform-input-wrapper">
                      <input
                        type="text"
                        value={item.platform}
                        onChange={(e) => updatePlatformName(item.id, e.target.value)}
                        className="platform-input"
                        placeholder="Platform name"
                      />
                      <span className="filename-hint">Source: {item.filename}</span>
                    </div>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => updateAmount(item.id, e.target.value)}
                        className="amount-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-row">
                <span className="total-label">Total Income</span>
                <span className="total-amount">
                  ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="review-actions">
              <button className="btn btn-secondary" onClick={goBackToUpload}>
                ← Back to Files
              </button>
              <button
                className="btn btn-primary"
                onClick={generateReport}
                disabled={isProcessing}
              >
                {isProcessing ? 'Generating...' : 'Generate Combined Report'}
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
            <li>Upload 2-{MAX_FILES} PDF income reports from different platforms</li>
            <li>Enter your name, income period, and verify the detected amounts</li>
            <li>Generate a professional combined report with cover page</li>
          </ol>
          <p className="info-note">
            Perfect for combining multiple income reports for landlords, lenders, or verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
