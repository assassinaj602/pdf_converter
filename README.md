# PDF Pro Converter

A lightweight, client-side PDF toolkit built with vanilla HTML/CSS/JS using PDF.js, PDF-lib, jsPDF, JSZip, SheetJS, and PptxGenJS.

## Features
- PDF → Images (PNG/JPEG, scale control)
- Images → PDF (size, orientation)
- Compress, Merge, Split (pages/range/each)
- Rotate, Watermark, Crop
- PDF → Text, PDF → HTML, PDF → PPTX
- Table extractor to CSV/XLSX

## UI
- Professional blue/slate theme with teal/cyan accent
- Light/Dark mode toggle with persistence
- Polished inputs, previews, loaders, and tab headers

## Run locally
Just open `index.html` in a modern browser (no server required).

## Dev notes
- Worker: pdf.js worker set via CDN in `pdfService.js`
- No build tooling; static app

## License
MIT
