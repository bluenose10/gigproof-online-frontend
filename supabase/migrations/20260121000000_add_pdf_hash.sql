-- Add PDF hash column for tamper detection
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS pdf_hash TEXT;

-- Create index for PDF hash lookups
CREATE INDEX IF NOT EXISTS idx_reports_pdf_hash ON public.reports(pdf_hash);

-- Add comment explaining the column
COMMENT ON COLUMN public.reports.pdf_hash IS 'SHA-256 hash of the generated PDF file for tamper detection';
