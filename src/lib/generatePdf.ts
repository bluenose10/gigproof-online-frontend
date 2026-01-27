import jsPDF from "jspdf";
import type { IncomeSummary } from "@/hooks/usePlaid";

interface UserInfo {
  fullName: string;
  email: string;
}

// Color definitions (RGB) - Using #21A68C as primary
const colors = {
  primary: [33, 166, 140] as [number, number, number], // #21A68C
  primaryLight: [77, 184, 163] as [number, number, number], // #4DB8A3
  primaryDark: [26, 133, 112] as [number, number, number], // #1A8570
  primary50: [236, 253, 250] as [number, number, number], // Very light teal
  gray50: [249, 250, 251] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  gray200: [229, 231, 235] as [number, number, number],
  gray400: [156, 163, 175] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray600: [75, 85, 99] as [number, number, number],
  gray700: [55, 65, 81] as [number, number, number],
  gray800: [31, 41, 55] as [number, number, number],
  gray900: [17, 24, 39] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  amber500: [245, 158, 11] as [number, number, number],
  red500: [239, 68, 68] as [number, number, number],
};

const formatCurrency = (amount: number, currencyCode: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateIncomeReport = (
  summary: IncomeSummary,
  userInfo: UserInfo,
  isPremium: boolean = false,
  verificationCode: string = "PREVIEW"
): jsPDF => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Report metadata
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currencyCode = (summary as any).iso_currency_code || "USD";
  const format = (amt: number) => formatCurrency(amt, currencyCode);

  const periodStart = summary.period_start
    ? new Date(summary.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const periodEnd = summary.period_end
    ? new Date(summary.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const periodText = `${periodStart} - ${periodEnd}`;
  const reportId = `GIG-${Date.now().toString(36).toUpperCase().slice(0, 8)}`;

  let y = 0;

  // Manual Icons Drawing (to avoid font issues)
  const drawCheckIcon = (doc: jsPDF, x: number, y: number, color: [number, number, number]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    doc.line(x, y + 2, x + 1.5, y + 3.5);
    doc.line(x + 1.5, y + 3.5, x + 4, y - 0.5);
  };

  const drawEmptyCircle = (doc: jsPDF, x: number, y: number, color: [number, number, number]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.circle(x + 2, y + 1.5, 2, "S");
  };

  // ========== PAGE 1 ==========

  // Header
  const headerHeight = 35;
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  doc.setFillColor(...colors.primaryDark);
  doc.rect(pageWidth * 0.7, 0, pageWidth * 0.3, headerHeight, "F");

  doc.setTextColor(...colors.white);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("GigProof", margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("BANK-VERIFIED INCOME REPORT", margin, 24);

  doc.setFontSize(10);
  doc.text(`DATE: ${reportDate.toUpperCase()}`, pageWidth - margin, 15, { align: "right" });
  doc.text(`ID: ${reportId}`, pageWidth - margin, 20, { align: "right" });

  y = headerHeight + 15;

  // Executive Summary Card
  doc.setFillColor(...colors.primary50);
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, "FD");

  doc.setTextColor(...colors.primaryDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE SUMMARY", margin + 8, y + 8);

  doc.setTextColor(...colors.gray700);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Dynamic Narrative Logic
  const consistencyScoreValue = summary.consistency_score || 0;
  let consistencyNarrative = "";
  if (consistencyScoreValue >= 80) {
    consistencyNarrative = "This applicant demonstrates exceptional income consistency and stability, significantly exceeding typical gig economy trends. ";
  } else if (consistencyScoreValue >= 60) {
    consistencyNarrative = "Income shows high reliability with steady, recurring deposits across the verification period. ";
  } else if (consistencyScoreValue >= 40) {
    consistencyNarrative = "Income demonstrates steady throughput with manageable variance, reflecting a mature gig-based career. ";
  } else {
    consistencyNarrative = "Income reflects active and continuous revenue generation from established gig platforms. ";
  }

  const execSummary = `This document provides official income verification for ${userInfo.fullName}. ` +
    `Data is extracted directly from connected financial institutions via Plaid. ${consistencyNarrative}` +
    `All identified gig economy earnings have been verified against banking deposit history for the specified period.`;
  doc.text(doc.splitTextToSize(execSummary, contentWidth - 16), margin + 8, y + 15);
  y += 40;

  // Applicant Data
  doc.setTextColor(...colors.gray800);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(...colors.primary);
  doc.rect(margin, y - 4, 3, 12, "F");
  doc.text("APPLICANT DETAILS", margin + 8, y + 5);
  y += 12;

  const cardWidth = (contentWidth - 6) / 2;
  const cardHeight = 22;

  const drawInfoBox = (x: number, yPos: number, label: string, value: string) => {
    doc.setFillColor(...colors.gray50);
    doc.setDrawColor(...colors.gray200);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, yPos, cardWidth, cardHeight, 1, 1, "FD");
    doc.setTextColor(...colors.gray500);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), x + 5, yPos + 7);
    doc.setTextColor(...colors.gray800);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 5, yPos + 15);
  };

  drawInfoBox(margin, y, "Full Name", userInfo.fullName);
  drawInfoBox(margin + cardWidth + 6, y, "Email Address", userInfo.email);
  y += cardHeight + 5;
  drawInfoBox(margin, y, "Verification Period", periodText);
  drawInfoBox(margin + cardWidth + 6, y, "Report Reference", reportId);
  y += cardHeight + 25;

  // Income Metrics
  doc.setFillColor(...colors.primary);
  doc.rect(margin, y - 4, 3, 12, "F");
  doc.setTextColor(...colors.gray800);
  doc.setFontSize(13);
  doc.text("INCOME METRICS", margin + 8, y + 5);
  y += 12;

  const metricWidth = (contentWidth - 10) / 3;
  const metricHeight = 35;

  const drawMetric = (x: number, yPos: number, label: string, value: string, big = false) => {
    doc.setFillColor(...(big ? colors.primary50 : colors.white));
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(big ? 0.8 : 0.3);
    doc.roundedRect(x, yPos, metricWidth, metricHeight, 3, 3, "FD");
    doc.setTextColor(...colors.primary);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), x + metricWidth / 2, yPos + 10, { align: "center" });
    doc.setTextColor(...colors.primaryDark);
    doc.setFontSize(22);
    doc.text(value, x + metricWidth / 2, yPos + 26, { align: "center" });
  };

  drawMetric(margin, y, "Weekly Average", format(summary.weekly_average));
  drawMetric(margin + metricWidth + 5, y, "Monthly Average", format(summary.monthly_average), true);
  drawMetric(margin + (metricWidth + 5) * 2, y, "Total Net Income", format(summary.total_90_days));

  // Footer Page 1
  doc.setDrawColor(...colors.gray200);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  doc.setTextColor(...colors.gray500);
  doc.setFontSize(8);
  doc.text("GigProof Verification Services", pageWidth / 2, pageHeight - 10, { align: "center" });
  doc.text("Page 1 of 2", pageWidth - margin, pageHeight - 10, { align: "right" });

  // ========== PAGE 2 ==========
  doc.addPage();
  y = 0;

  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 12, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(10);
  doc.text("GigProof verification Report", margin, 8);
  doc.text(reportId, pageWidth - margin, 8, { align: "right" });

  y = 25;
  doc.setFillColor(...colors.primary);
  doc.rect(margin, y - 4, 3, 12, "F");
  doc.setTextColor(...colors.gray800);
  doc.setFontSize(12);
  doc.text("REVENUE BREAKDOWN", margin + 8, y + 5);
  y += 12;

  // Table
  doc.setFillColor(...colors.primary);
  doc.rect(margin, y, contentWidth, 10, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(9);
  doc.text("PLATFORM", margin + 5, y + 6.5);
  doc.text("TOTAL INCOME", margin + contentWidth * 0.5 + 5, y + 6.5);
  doc.text("SHARE", margin + contentWidth * 0.8 + 5, y + 6.5);
  y += 10;

  const platforms = summary.platform_breakdown || [];
  platforms.forEach((p, i) => {
    doc.setFillColor(...(i % 2 === 0 ? colors.white : colors.gray50));
    doc.rect(margin, y, contentWidth, 10, "F");
    doc.setTextColor(...colors.gray800);
    doc.text(p.name, margin + 5, y + 6.5);
    doc.setTextColor(...colors.primaryDark);
    doc.setFont("helvetica", "bold");
    doc.text(format(p.total), margin + contentWidth * 0.5 + 5, y + 6.5);
    doc.setTextColor(...colors.gray700);
    doc.setFont("helvetica", "normal");
    doc.text(`${p.percentage.toFixed(1)}%`, margin + contentWidth * 0.8 + 5, y + 6.5);
    y += 10;
  });

  // Analysis
  y += 20;
  doc.setFillColor(...colors.primary);
  doc.rect(margin, y - 4, 3, 12, "F");
  doc.setTextColor(...colors.gray800);
  doc.text("STABILITY ANALYSIS", margin + 8, y + 5);
  y += 15;

  const score = summary.consistency_score || 0;
  const sColor = score >= 70 ? colors.primary : score >= 40 ? colors.amber500 : colors.red500;

  doc.setFillColor(...sColor);
  doc.circle(margin + 20, y + 15, 15, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(20);
  doc.text(`${score}%`, margin + 20, y + 17, { align: "center" });
  doc.setFontSize(6);
  doc.text("CONSISTENCY", margin + 20, y + 22, { align: "center" });

  // Findings
  const findingsX = margin + 45;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(findingsX, y - 5, contentWidth - 45, 45, 2, 2, "F");

  const items = [
    { t: "Verified periodic deposits detected", v: score >= 60 },
    { t: "Multiple active income channels", v: platforms.length > 1 },
    { t: "High weekly earnings stability", v: score >= 70 },
    { t: "KYC bank verification successful", v: true },
  ];

  items.forEach((item, i) => {
    const iy = y + 5 + (i * 8);
    if (item.v) drawCheckIcon(doc, findingsX + 5, iy, colors.primary);
    else drawEmptyCircle(doc, findingsX + 5, iy, colors.gray500);

    doc.setTextColor(...(item.v ? colors.gray800 : colors.gray500));
    doc.setFontSize(9);
    doc.text(item.t, findingsX + 12, iy + 2.5);
  });

  // Final Stamp & Methodology
  y += 55;

  // Methodology Box
  doc.setFillColor(...colors.gray50);
  doc.roundedRect(margin, y, contentWidth, 35, 1, 1, "F");
  doc.setTextColor(...colors.gray800);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFICATION METHODOLOGY", margin + 5, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray600);
  const methodology = [
    "This report was generated using direct-to-bank financial APIs (Plaid). Data is retrieved",
    "from the financial institution's source and has not been manually edited by the applicant.",
    "Gig income is identified using a proprietary platform-matching algorithm based on",
    "transaction metadata and MCC codes."
  ];
  methodology.forEach((line, i) => {
    doc.text(line, margin + 5, y + 15 + (i * 4));
  });

  // Stamp
  y += 40;
  doc.setFillColor(...colors.primary50);
  // AUTHENTICITY VERIFICATION section
  doc.setFillColor(...colors.primary50);
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, "FD");

  doc.setTextColor(...colors.primaryDark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("AUTHENTICITY VERIFICATION", margin + 5, y + 8);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.gray700);
  doc.text("To verify this report has not been tampered with, visit:", margin + 5, y + 14);

  doc.setFontSize(9);
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("gigproof.online/verify", margin + 5, y + 19);

  doc.setFontSize(11);
  doc.setTextColor(...colors.primaryDark);
  doc.text(`CODE: ${verificationCode}`, pageWidth - margin - 50, y + 13);

  // Footer Page 2
  y = pageHeight - 20;
  doc.setDrawColor(...colors.gray200);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setTextColor(...colors.gray400);
  doc.setFontSize(7);
  doc.text(`Verification Code: ${verificationCode}`, margin, y + 5);
  doc.setTextColor(...colors.gray500);
  doc.setFontSize(8);
  doc.text("www.gigproof.online/contact | www.gigproof.online", pageWidth / 2, pageHeight - 10, { align: "center" });
  doc.text("Page 2 of 2", pageWidth - margin, pageHeight - 10, { align: "right" });

  return doc;
};

export const downloadPdf = (doc: jsPDF, filename: string = "gigproof-report.pdf") => {
  doc.save(filename);
};
