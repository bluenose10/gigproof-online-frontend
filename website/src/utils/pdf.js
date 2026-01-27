import { jsPDF } from 'jspdf';
import { CONFIG } from '../config';
import { PDF_COPY } from './pdfCopy';

const formatDate = (date) => {
    try {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return date.toISOString().slice(0, 10);
    }
};

const makeReportId = () => `GIG-${Date.now().toString(36).toUpperCase()}`;

const drawSectionTitle = (doc, title, y) => {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(20, y - 6, 90, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setTextColor(4, 120, 87);
    doc.setFont(undefined, 'bold');
    doc.text(title.toUpperCase(), 24, y);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y + 4, 190, y + 4);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(15, 23, 42);
};

export const generateIncomeSummaryPdf = ({ data, userEmail, userName, watermarked = false }) => {
    const doc = new jsPDF();
    const reportId = makeReportId();
    const dateLabel = formatDate(new Date());

    doc.setFillColor(236, 253, 245);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(24);
    doc.setTextColor(15, 118, 110);
    doc.text(PDF_COPY.title, 20, 24);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(PDF_COPY.subtitle, 20, 32);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Generated On: ${dateLabel}`, 150, 18);
    doc.text(`Report ID: ${reportId}`, 150, 26);

    let y = 52;
    drawSectionTitle(doc, 'Executive Summary', y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    const summaryText = PDF_COPY.executiveSummary;
    const summaryLines = doc.splitTextToSize(summaryText, 170);
    doc.text(summaryLines, 20, y);
    y += summaryLines.length * 5 + 10;

    drawSectionTitle(doc, 'Applicant Details', y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);

    const detailRows = [
        [PDF_COPY.labels.fullName, userName || '-'],
        [PDF_COPY.labels.accountEmail, userEmail || '-'],
        [PDF_COPY.labels.platform, Array.isArray(data.platform) ? data.platform.join(', ') : data.platform || '-'],
        [PDF_COPY.labels.reportingPeriod, data.dateRange || 'Not specified'],
        [PDF_COPY.labels.reportReference, reportId]
    ];

    detailRows.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, 20, y);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), 90, y);
        y += 8;
    });

    y += 4;
    drawSectionTitle(doc, 'Income Metrics', y);
    y += 12;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, y - 2, 170, 30, 4, 4, 'F');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(PDF_COPY.labels.totalEarnings, 24, y + 8);
    doc.setFontSize(22);
    doc.setTextColor(15, 118, 110);
    doc.text(data.grossEarnings || 'N/A', 24, y + 22);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Currency: ${data.currency || 'N/A'}`, 120, y + 22);

    y += 34;

    drawSectionTitle(doc, 'Data Source', y);
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const sourceText = PDF_COPY.dataSource;
    const sourceLines = doc.splitTextToSize(sourceText, 170);
    doc.text(sourceLines, 20, y);
    y += sourceLines.length * 5 + 10;

    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFillColor(220, 252, 231);
    doc.roundedRect(20, y, 170, 8, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(4, 120, 87);
    doc.setFont(undefined, 'bold');
    doc.text('DISCLAIMER', 24, y + 6);
    doc.setFont(undefined, 'normal');
    y += 12;
    const disclaimerLines = doc.splitTextToSize(CONFIG.PDF_DISCLAIMER, 162);
    const disclaimerHeight = disclaimerLines.length * 5 + 8;
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(20, y, 170, disclaimerHeight, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(disclaimerLines, 24, y + 6);
    y += disclaimerHeight + 4;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(PDF_COPY.footerTrustLine, 20, 282);
    doc.text('support@gigproof.online | www.gigproof.online', 20, 288);

    if (watermarked) {
        doc.setFontSize(42);
        doc.setTextColor(226, 232, 240);
        doc.setFont(undefined, 'bold');
        doc.text('WATERMARK', 105, 160, { align: 'center', angle: 35 });
        doc.setFont(undefined, 'normal');
    }

    return doc;
};
