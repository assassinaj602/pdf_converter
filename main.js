/**
 * Main entry point - Initialize app and wire up events
 */

class App {
    constructor() {
        this.viewModel = new ViewModel();
        this.convertedImageBlobs = []; // Store converted images for ZIP download
        this.initializeEventListeners();
        this.subscribeToStateChanges();
    }

    /**
     * Initialize tab event listeners with improved click handling
     */
    initializeTabEventListeners() {
        // Force buttons to behave as buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.setAttribute('type', 'button'));

        // Robust delegated handler on container (works even if buttons are re-rendered)
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-button');
                if (!btn) return;
                e.preventDefault();
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });

            tabsContainer.addEventListener('touchend', (e) => {
                const btn = e.target.closest('.tab-button');
                if (!btn) return;
                e.preventDefault();
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        }

        // Fallback direct handlers (kept lightweight)
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Initialize tab event listeners first with the specialized function
        this.initializeTabEventListeners();

        // File inputs
        const pdfInput = document.getElementById('pdf-input');
        if (pdfInput) {
            pdfInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.viewModel.setSelectedPdf(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        const imagesInput = document.getElementById('images-input');
        if (imagesInput) {
            imagesInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                const validFiles = files.filter(file => Utils.validateFileType(file, ['image']));

                if (validFiles.length !== files.length) {
                    Utils.showError('Some files were not valid images and were ignored');
                }

                if (validFiles.length > 0) {
                    this.viewModel.setSelectedImages(validFiles);
                }
            });
        }

        // Compress PDF input
        const compressInput = document.getElementById('compress-input');
        if (compressInput) {
            compressInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleCompressFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        // Merge PDFs input
        const mergeInput = document.getElementById('merge-input');
        if (mergeInput) {
            mergeInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                const validFiles = files.filter(file => Utils.validateFileType(file, ['pdf']));

                if (validFiles.length !== files.length) {
                    Utils.showError('Some files were not valid PDFs and were ignored');
                }

                if (validFiles.length > 0) {
                    this.handleMergeFiles(validFiles);
                }
            });
        }

        // Split PDF input
        const splitInput = document.getElementById('split-input');
        if (splitInput) {
            splitInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleSplitFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        // Convert buttons
        const convertPdfBtn = document.getElementById('convert-pdf-btn');
        if (convertPdfBtn) {
            convertPdfBtn.addEventListener('click', () => {
                this.viewModel.convertPdfToImages();
            });
        }

        const convertImagesBtn = document.getElementById('convert-images-btn');
        if (convertImagesBtn) {
            convertImagesBtn.addEventListener('click', () => {
                this.viewModel.convertImagesToPdf();
            });
        }

        // Additional function buttons
        const compressBtn = document.getElementById('compress-btn');
        if (compressBtn) {
            compressBtn.addEventListener('click', () => {
                this.compressPdf();
            });
        }

        const mergeBtn = document.getElementById('merge-btn');
        if (mergeBtn) {
            mergeBtn.addEventListener('click', () => {
                this.mergePdfs();
            });
        }

        const splitBtn = document.getElementById('split-btn');
        if (splitBtn) {
            splitBtn.addEventListener('click', () => {
                this.splitPdf();
            });
        }

        // ZIP Download button
        const downloadAllZip = document.getElementById('download-all-zip');
        if (downloadAllZip) {
            downloadAllZip.addEventListener('click', () => {
                this.downloadAllAsZip();
            });
        }

        // Split method selector
        const splitMethod = document.getElementById('split-method');
        if (splitMethod) {
            splitMethod.addEventListener('change', (e) => {
                const rangeDiv = document.getElementById('split-range');
                if (e.target.value === 'range') {
                    rangeDiv.style.display = 'block';
                } else {
                    rangeDiv.style.display = 'none';
                }
            });
        }

        // New tool inputs
        const rotateInput = document.getElementById('rotate-input');
        if (rotateInput) {
            rotateInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleRotateFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handlePasswordFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        const unlockInput = document.getElementById('unlock-input');
        if (unlockInput) {
            unlockInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleUnlockFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        const wordInput = document.getElementById('word-input');
        if (wordInput) {
            wordInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleWordFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        const watermarkInput = document.getElementById('watermark-input');
        if (watermarkInput) {
            watermarkInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleWatermarkFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }

        // New tool buttons
        const rotateBtn = document.getElementById('rotate-btn');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.rotatePdf();
            });
        }

        const passwordProtectBtn = document.getElementById('password-protect-btn');
        if (passwordProtectBtn) {
            passwordProtectBtn.addEventListener('click', () => {
                this.passwordProtectPdf();
            });
        }

        const unlockBtn = document.getElementById('unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                this.unlockPdf();
            });
        }

        const convertWordBtn = document.getElementById('convert-word-btn');
        if (convertWordBtn) {
            convertWordBtn.addEventListener('click', () => {
                this.convertPdfToWord();
            });
        }

        const watermarkBtn = document.getElementById('watermark-btn');
        if (watermarkBtn) {
            watermarkBtn.addEventListener('click', () => {
                this.addWatermarkToPdf();
            });
        }

        // Crop PDF input
        const cropInput = document.getElementById('crop-input');
        if (cropInput) {
            cropInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleCropFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const cropBtn = document.getElementById('crop-btn');
        if (cropBtn) {
            cropBtn.addEventListener('click', () => {
                this.cropPdf();
            });
        }

        // PDF Table Extractor input
        const tableInput = document.getElementById('table-input');
        if (tableInput) {
            tableInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleTableFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const extractTableBtn = document.getElementById('extract-table-btn');
        if (extractTableBtn) {
            extractTableBtn.addEventListener('click', () => {
                this.extractTable();
            });
        }

        // PDF to PPTX input
        const pptxInput = document.getElementById('pptx-input');
        if (pptxInput) {
            pptxInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handlePptxFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const convertPptxBtn = document.getElementById('convert-pptx-btn');
        if (convertPptxBtn) {
            convertPptxBtn.addEventListener('click', () => {
                this.convertToPptx();
            });
        }

        // PDF Redactor input
        const redactInput = document.getElementById('redact-input');
        if (redactInput) {
            redactInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleRedactFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const applyRedactBtn = document.getElementById('apply-redact-btn');
        if (applyRedactBtn) {
            applyRedactBtn.addEventListener('click', () => {
                this.applyRedaction();
            });
        }
        // Canvas drawing events for redaction
        const redactCanvas = document.getElementById('redact-canvas');
        if (redactCanvas) {
            let isDrawing = false;
            let startX = 0, startY = 0;
            this.redactRects = [];
            redactCanvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                const rect = redactCanvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
            });
            redactCanvas.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;
                const rect = redactCanvas.getBoundingClientRect();
                const currX = e.clientX - rect.left;
                const currY = e.clientY - rect.top;
                this.renderRedactPreview(this.redactPageImage, this.redactRects, {
                    x: startX, y: startY, w: currX - startX, h: currY - startY
                });
            });
            redactCanvas.addEventListener('mouseup', (e) => {
                if (!isDrawing) return;
                isDrawing = false;
                const rect = redactCanvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                const newRect = {
                    x: Math.min(startX, endX),
                    y: Math.min(startY, endY),
                    w: Math.abs(endX - startX),
                    h: Math.abs(endY - startY)
                };
                if (newRect.w > 5 && newRect.h > 5) {
                    this.redactRects.push(newRect);
                }
                this.renderRedactPreview(this.redactPageImage, this.redactRects);
            });
        }

        // PDF Compare inputs
        const compareInput1 = document.getElementById('compare-input-1');
        const compareInput2 = document.getElementById('compare-input-2');
        let compareFile1 = null, compareFile2 = null;
        if (compareInput1) {
            compareInput1.addEventListener('change', (e) => {
                compareFile1 = e.target.files[0];
                this.handleCompareFiles(compareFile1, compareFile2);
            });
        }
        if (compareInput2) {
            compareInput2.addEventListener('change', (e) => {
                compareFile2 = e.target.files[0];
                this.handleCompareFiles(compareFile1, compareFile2);
            });
        }
        const compareBtn = document.getElementById('compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.comparePdfs(compareFile1, compareFile2);
            });
        }

        // PDF to Audio input
        const audioInput = document.getElementById('audio-input');
        if (audioInput) {
            audioInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleAudioFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const convertAudioBtn = document.getElementById('convert-audio-btn');
        if (convertAudioBtn) {
            convertAudioBtn.addEventListener('click', () => {
                this.convertToAudio();
            });
        }

        // PDF Form Filler input
        const formFillInput = document.getElementById('formfill-input');
        if (formFillInput) {
            formFillInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    await this.handleFormFillFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const fillFormBtn = document.getElementById('fill-form-btn');
        if (fillFormBtn) {
            fillFormBtn.addEventListener('click', () => {
                this.fillForm();
            });
        }

        // PDF Page Numbering input
        const pageNumInput = document.getElementById('pagenum-input');
        if (pageNumInput) {
            pageNumInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handlePageNumFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const addPageNumBtn = document.getElementById('add-pagenum-btn');
        if (addPageNumBtn) {
            addPageNumBtn.addEventListener('click', () => {
                this.addPageNumbers();
            });
        }

        // PDF to HTML input
        const htmlInput = document.getElementById('html-input');
        if (htmlInput) {
            htmlInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && Utils.validateFileType(file, ['pdf'])) {
                    this.handleHtmlFile(file);
                } else if (file) {
                    Utils.showError('Please select a valid PDF file');
                }
            });
        }
        const convertHtmlBtn = document.getElementById('convert-html-btn');
        if (convertHtmlBtn) {
            convertHtmlBtn.addEventListener('click', () => {
                this.convertToHtml();
            });
        }
    }

    /**
     * Download all converted images as ZIP
     */
    async downloadAllAsZip() {
        if (!this.convertedImageBlobs || this.convertedImageBlobs.length === 0) {
            Utils.showError('No images to download. Please convert a PDF first.');
            return;
        }

        try {
            // Create new ZIP file
            const zip = new JSZip();

            // Add each image to ZIP
            for (let i = 0; i < this.convertedImageBlobs.length; i++) {
                const blob = this.convertedImageBlobs[i];
                const filename = `page_${i + 1}.png`;
                zip.file(filename, blob);
            }

            // Generate ZIP file
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Create download link and trigger download
            const downloadLink = Utils.createDownloadLink(zipBlob, 'converted_images.zip', 'Download ZIP');
            downloadLink.click();

        } catch (error) {
            console.error('Error creating ZIP:', error);
            Utils.showError('Failed to create ZIP file. Please try again.');
        }
    }

    /**
     * Subscribe to state changes and update UI
     */
    subscribeToStateChanges() {
        this.viewModel.subscribe((state, changedProperty) => {
            switch (changedProperty) {
                case 'selectedPdf':
                    this.updatePdfSelection(state.selectedPdf);
                    break;
                case 'selectedImages':
                    this.updateImageSelection(state.selectedImages);
                    break;
                case 'isLoading':
                    this.updateLoadingState(state.isLoading, state.activeTab);
                    break;
                case 'resultBlobs':
                    this.updateResults(state.resultBlobs, state.activeTab);
                    break;
                case 'activeTab':
                    this.updateActiveTab(state.activeTab);
                    break;
            }
        });
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        this.viewModel.setActiveTab(tabName);
        // Apply UI update immediately for responsiveness
        this.updateActiveTab(tabName);
    }

    /**
     * Update active tab UI
     */
    updateActiveTab(activeTab) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === activeTab);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === activeTab);
        });

    // Clear file inputs (guard against null on tabs without these controls)
    const pdfIn = document.getElementById('pdf-input');
    if (pdfIn) pdfIn.value = '';
    const imgIn = document.getElementById('images-input');
    if (imgIn) imgIn.value = '';
    }

    /**
     * Update PDF selection UI
     */
    updatePdfSelection(selectedPdf) {
        const button = document.getElementById('convert-pdf-btn');
        const label = document.querySelector('label[for="pdf-input"] span');

        if (selectedPdf) {
            button.disabled = false;
            label.textContent = `Selected: ${selectedPdf.name}`;
        } else {
            button.disabled = true;
            label.textContent = 'Choose PDF File';
        }
    }

    /**
     * Update image selection UI
     */
    updateImageSelection(selectedImages) {
        const button = document.getElementById('convert-images-btn');
        const label = document.querySelector('label[for="images-input"] span');
        const previewContainer = document.getElementById('selected-preview');
        const selectedSection = document.getElementById('selected-images');

        if (selectedImages.length > 0) {
            button.disabled = false;
            label.textContent = `Selected: ${selectedImages.length} image(s)`;

            // Show preview
            previewContainer.innerHTML = '';
            selectedImages.forEach((file, index) => {
                const preview = Utils.createPreviewImage(file, `Image ${index + 1}`);
                previewContainer.appendChild(preview);
            });
            selectedSection.classList.add('show');
        } else {
            button.disabled = true;
            label.textContent = 'Choose Image Files';
            selectedSection.classList.remove('show');
        }
    }

    /**
     * Update loading state UI
     */
    updateLoadingState(isLoading, activeTab) {
        const loaderId = activeTab === 'pdf-to-images' ? 'pdf-loader' : 'images-loader';
        const loader = document.getElementById(loaderId);

        if (isLoading) {
            loader.classList.add('show');
            // Disable buttons during loading
            document.getElementById('convert-pdf-btn').disabled = true;
            document.getElementById('convert-images-btn').disabled = true;
        } else {
            loader.classList.remove('show');
            // Re-enable buttons based on selection
            this.updatePdfSelection(this.viewModel.state.selectedPdf);
            this.updateImageSelection(this.viewModel.state.selectedImages);
        }
    }

    /**
     * Update results UI
     */
    updateResults(resultBlobs, activeTab) {
        if (activeTab === 'pdf-to-images') {
            this.updateImageResults(resultBlobs);
        } else {
            this.updatePdfResults(resultBlobs);
        }
    }

    /**
     * Update image conversion results
     */
    updateImageResults(imageBlobs) {
        const resultsSection = document.getElementById('pdf-results');
        const previewContainer = document.getElementById('images-preview');
        const downloadContainer = document.querySelector('#images-download .individual-downloads');
        const zipButton = document.getElementById('download-all-zip');

        if (imageBlobs.length > 0) {
            // Store blobs for ZIP download
            this.convertedImageBlobs = imageBlobs;

            // Show/hide ZIP button based on number of images
            if (imageBlobs.length > 1) {
                zipButton.style.display = 'inline-flex';
            } else {
                zipButton.style.display = 'none';
            }

            // Show preview
            previewContainer.innerHTML = '';
            imageBlobs.forEach((blob, index) => {
                const preview = Utils.createPreviewImage(blob, `Page ${index + 1}`);
                previewContainer.appendChild(preview);
            });

            // Show download links
            downloadContainer.innerHTML = '';
            imageBlobs.forEach((blob, index) => {
                const downloadLink = Utils.createDownloadLink(blob, `page-${index + 1}.png`, `Download Page ${index + 1}`);
                downloadContainer.appendChild(downloadLink);
            });

            resultsSection.classList.add('show');
        } else {
            this.convertedImageBlobs = [];
            zipButton.style.display = 'none';
            resultsSection.classList.remove('show');
        }
    }

    /**
     * Update PDF conversion results
     */
    updatePdfResults(pdfBlobs) {
        const resultsSection = document.getElementById('images-results');
        const downloadContainer = document.getElementById('pdf-download');

        if (pdfBlobs.length > 0) {
            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(pdfBlobs[0], 'converted.pdf', 'Download PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
        } else {
            resultsSection.classList.remove('show');
        }
    }

    /**
     * Handle compress file selection
     */
    handleCompressFile(file) {
        this.compressFile = file;
        const button = document.getElementById('compress-btn');
        const label = document.querySelector('label[for="compress-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    /**
     * Handle merge files selection
     */
    handleMergeFiles(files) {
        this.mergeFiles = files;
        const button = document.getElementById('merge-btn');
        const label = document.querySelector('label[for="merge-input"] span');
        const listContainer = document.getElementById('pdf-list');
        const selectedSection = document.getElementById('selected-pdfs');

        button.disabled = false;
        label.textContent = `Selected: ${files.length} PDF(s)`;

        // Show file list
        listContainer.innerHTML = '';
        files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-list-item';
            item.textContent = `${index + 1}. ${file.name}`;
            listContainer.appendChild(item);
        });
        selectedSection.classList.add('show');
    }

    /**
     * Handle split file selection
     */
    handleSplitFile(file) {
        this.splitFile = file;
        const button = document.getElementById('split-btn');
        const label = document.querySelector('label[for="split-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    /**
     * New tool handlers
     */
    handleRotateFile(file) {
        this.rotateFile = file;
        const button = document.getElementById('rotate-btn');
        const label = document.querySelector('label[for="rotate-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handlePasswordFile(file) {
        this.passwordFile = file;
        const button = document.getElementById('password-protect-btn');
        const label = document.querySelector('label[for="password-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleUnlockFile(file) {
        this.unlockFile = file;
        const button = document.getElementById('unlock-btn');
        const label = document.querySelector('label[for="unlock-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleWordFile(file) {
        this.wordFile = file;
        const button = document.getElementById('convert-word-btn');
        const label = document.querySelector('label[for="word-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleWatermarkFile(file) {
        this.watermarkFile = file;
        const button = document.getElementById('watermark-btn');
        const label = document.querySelector('label[for="watermark-input"] span');

        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleCropFile(file) {
        this.cropFile = file;
        const button = document.getElementById('crop-btn');
        const label = document.querySelector('label[for="crop-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleTableFile(file) {
        this.tableFile = file;
        const button = document.getElementById('extract-table-btn');
        const label = document.querySelector('label[for="table-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handlePptxFile(file) {
        this.pptxFile = file;
        const button = document.getElementById('convert-pptx-btn');
        const label = document.querySelector('label[for="pptx-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    handleRedactFile(file) {
        this.redactFile = file;
        this.redactRects = [];
        const button = document.getElementById('apply-redact-btn');
        const label = document.querySelector('label[for="redact-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
        this.renderRedactPreview(null, []);
        this.loadRedactPreview(file);
    }

    async loadRedactPreview(file) {
        // Render first page of PDF to canvas and store image for drawing
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = document.getElementById('redact-canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            // Store image for later redraws
            this.redactPageImage = new Image();
            this.redactPageImage.src = canvas.toDataURL('image/png');
            this.redactPageImage.onload = () => {
                this.renderRedactPreview(this.redactPageImage, this.redactRects);
            };
        } catch (error) {
            Utils.showError('Failed to render PDF preview: ' + error.message);
        }
    }

    renderRedactPreview(img, rects, tempRect) {
        const canvas = document.getElementById('redact-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'black';
        if (rects) {
            for (const r of rects) {
                ctx.fillRect(r.x, r.y, r.w, r.h);
            }
        }
        if (tempRect) {
            ctx.globalAlpha = 0.4;
            ctx.fillRect(tempRect.x, tempRect.y, tempRect.w, tempRect.h);
        }
        ctx.restore();
    }

    async applyRedaction() {
        if (!this.redactFile || !this.redactRects || this.redactRects.length === 0) {
            Utils.showError('Please select a PDF and draw at least one rectangle to redact.');
            return;
        }
        try {
            const loader = document.getElementById('redact-loader');
            loader.classList.add('show');
            const redactedBlob = await PdfService.redactPdf(this.redactFile, this.redactRects);
            const resultsSection = document.getElementById('redact-results');
            const downloadContainer = document.getElementById('redact-download');
            downloadContainer.innerHTML = '';
            if (redactedBlob) {
                const redactLink = Utils.createDownloadLink(redactedBlob, 'redacted.pdf', 'Download Redacted PDF');
                downloadContainer.appendChild(redactLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to apply redaction: ' + error.message);
            document.getElementById('redact-loader').classList.remove('show');
        }
    }

    /**
     * Compress PDF
     */
    async compressPdf() {
        if (!this.compressFile) return;

        try {
            const loader = document.getElementById('compress-loader');
            loader.classList.add('show');

            const compressionLevel = parseFloat(document.getElementById('compression-level').value);
            const compressedBlob = await PdfService.compressPdf(this.compressFile, compressionLevel);

            // Show results
            const resultsSection = document.getElementById('compress-results');
            const downloadContainer = document.getElementById('compress-download');
            const statsContainer = document.getElementById('compression-stats');

            const originalSize = this.compressFile.size;
            const compressedSize = compressedBlob.size;
            const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            statsContainer.innerHTML = `
                <p>Original Size: ${Utils.formatFileSize(originalSize)}</p>
                <p>Compressed Size: ${Utils.formatFileSize(compressedSize)}</p>
                <p>Space Saved: ${savings}%</p>
            `;

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(compressedBlob, 'compressed.pdf', 'Download Compressed PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to compress PDF: ' + error.message);
            document.getElementById('compress-loader').classList.remove('show');
        }
    }

    /**
     * Merge PDFs
     */
    async mergePdfs() {
        if (!this.mergeFiles || this.mergeFiles.length === 0) return;

        try {
            const loader = document.getElementById('merge-loader');
            loader.classList.add('show');

            const mergedBlob = await PdfService.mergePdfs(this.mergeFiles);

            // Show results
            const resultsSection = document.getElementById('merge-results');
            const downloadContainer = document.getElementById('merge-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(mergedBlob, 'merged.pdf', 'Download Merged PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to merge PDFs: ' + error.message);
            document.getElementById('merge-loader').classList.remove('show');
        }
    }

    /**
     * Split PDF
     */
    async splitPdf() {
        if (!this.splitFile) return;

        try {
            const loader = document.getElementById('split-loader');
            loader.classList.add('show');

            const method = document.getElementById('split-method').value;
            let ranges = null;

            if (method === 'range') {
                ranges = document.getElementById('page-ranges').value;
                if (!ranges || ranges.trim() === '') {
                    Utils.showError('Please enter page ranges (e.g., 1-3, 5-7)');
                    loader.classList.remove('show');
                    return;
                }
            } else if (method === 'pages') {
                // Ask user for pages per file
                const input = prompt('How many pages per split file?', '2');
                const pagesPerFile = parseInt(input, 10);
                if (!pagesPerFile || pagesPerFile < 1) {
                    Utils.showError('Please enter a valid number of pages per file (>=1).');
                    loader.classList.remove('show');
                    return;
                }
                // Pass the pages-per-file value via "ranges" param to the service
                ranges = String(pagesPerFile);
            }

            const splitPdfs = await PdfService.splitPdf(this.splitFile, method, ranges);

            // Show results
            const resultsSection = document.getElementById('split-results');
            const downloadContainer = document.getElementById('split-download');

            downloadContainer.innerHTML = '';
            splitPdfs.forEach(pdf => {
                const downloadLink = Utils.createDownloadLink(pdf.blob, pdf.name, `📄 Download ${pdf.name}`);
                downloadContainer.appendChild(downloadLink);
            });

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to split PDF: ' + error.message);
            document.getElementById('split-loader').classList.remove('show');
        }
    }

    /**
     * New tool functions
     */
    async rotatePdf() {
        if (!this.rotateFile) return;

        try {
            const loader = document.getElementById('rotate-loader');
            loader.classList.add('show');

            const angle = parseInt(document.getElementById('rotation-angle').value);
            const rotatedBlob = await PdfService.rotatePdf(this.rotateFile, angle);

            const resultsSection = document.getElementById('rotate-results');
            const downloadContainer = document.getElementById('rotate-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(rotatedBlob, 'rotated.pdf', 'Download Rotated PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to rotate PDF: ' + error.message);
            document.getElementById('rotate-loader').classList.remove('show');
        }
    }

    async passwordProtectPdf() {
        if (!this.passwordFile) return;

        const password = document.getElementById('pdf-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!password || password !== confirmPassword) {
            Utils.showError('Passwords do not match or are empty');
            return;
        }

        try {
            const loader = document.getElementById('password-loader');
            loader.classList.add('show');

            const protectedBlob = await PdfService.passwordProtectPdf(this.passwordFile, password);

            const resultsSection = document.getElementById('password-results');
            const downloadContainer = document.getElementById('password-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(protectedBlob, 'protected.pdf', 'Download Protected PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to password protect PDF: ' + error.message);
            document.getElementById('password-loader').classList.remove('show');
        }
    }

    async unlockPdf() {
        if (!this.unlockFile) return;

        const password = document.getElementById('unlock-password').value;

        if (!password) {
            Utils.showError('Please enter the PDF password');
            return;
        }

        try {
            const loader = document.getElementById('unlock-loader');
            loader.classList.add('show');

            const unlockedBlob = await PdfService.unlockPdf(this.unlockFile, password);

            const resultsSection = document.getElementById('unlock-results');
            const downloadContainer = document.getElementById('unlock-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(unlockedBlob, 'unlocked.pdf', 'Download Unlocked PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to unlock PDF: ' + error.message);
            document.getElementById('unlock-loader').classList.remove('show');
        }
    }

    async convertPdfToWord() {
        if (!this.wordFile) return;

        try {
            const loader = document.getElementById('word-loader');
            loader.classList.add('show');

            const wordBlob = await PdfService.pdfToWord(this.wordFile);

            const resultsSection = document.getElementById('word-results');
            const downloadContainer = document.getElementById('word-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(wordBlob, 'converted.txt', 'Download Text File');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to convert PDF to Word: ' + error.message);
            document.getElementById('word-loader').classList.remove('show');
        }
    }

    async addWatermarkToPdf() {
        if (!this.watermarkFile) return;

        const watermarkText = document.getElementById('watermark-text').value;

        if (!watermarkText) {
            Utils.showError('Please enter watermark text');
            return;
        }

        try {
            const loader = document.getElementById('watermark-loader');
            loader.classList.add('show');

            const opacity = parseFloat(document.getElementById('watermark-opacity').value);
            const watermarkedBlob = await PdfService.addWatermarkToPdf(this.watermarkFile, watermarkText, opacity);

            const resultsSection = document.getElementById('watermark-results');
            const downloadContainer = document.getElementById('watermark-download');

            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(watermarkedBlob, 'watermarked.pdf', 'Download Watermarked PDF');
            downloadContainer.appendChild(downloadLink);

            resultsSection.classList.add('show');
            loader.classList.remove('show');

        } catch (error) {
            Utils.showError('Failed to add watermark: ' + error.message);
            document.getElementById('watermark-loader').classList.remove('show');
        }
    }

    async cropPdf() {
        if (!this.cropFile) return;
        try {
            const loader = document.getElementById('crop-loader');
            loader.classList.add('show');
            const top = parseFloat(document.getElementById('crop-top').value) || 0;
            const right = parseFloat(document.getElementById('crop-right').value) || 0;
            const bottom = parseFloat(document.getElementById('crop-bottom').value) || 0;
            const left = parseFloat(document.getElementById('crop-left').value) || 0;
            const allPages = document.getElementById('crop-all-pages').checked;
            const croppedBlob = await PdfService.cropPdf(this.cropFile, { top, right, bottom, left, allPages });
            const resultsSection = document.getElementById('crop-results');
            const downloadContainer = document.getElementById('crop-download');
            downloadContainer.innerHTML = '';
            const downloadLink = Utils.createDownloadLink(croppedBlob, 'cropped.pdf', 'Download Cropped PDF');
            downloadContainer.appendChild(downloadLink);
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to crop PDF: ' + error.message);
            document.getElementById('crop-loader').classList.remove('show');
        }
    }

    async extractTable() {
        if (!this.tableFile) return;
        try {
            const loader = document.getElementById('table-loader');
            loader.classList.add('show');
            const { csvBlob, excelBlob } = await PdfService.extractTableFromPdf(this.tableFile);
            const resultsSection = document.getElementById('table-results');
            const downloadContainer = document.getElementById('table-download');
            downloadContainer.innerHTML = '';
            if (csvBlob) {
                const csvLink = Utils.createDownloadLink(csvBlob, 'extracted-table.csv', 'Download CSV');
                downloadContainer.appendChild(csvLink);
            }
            if (excelBlob) {
                const excelLink = Utils.createDownloadLink(excelBlob, 'extracted-table.xlsx', 'Download Excel');
                downloadContainer.appendChild(excelLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to extract table: ' + error.message);
            document.getElementById('table-loader').classList.remove('show');
        }
    }

    async convertToPptx() {
        if (!this.pptxFile) return;
        try {
            const loader = document.getElementById('pptx-loader');
            loader.classList.add('show');
            const pptxBlob = await PdfService.pdfToPptx(this.pptxFile);
            const resultsSection = document.getElementById('pptx-results');
            const downloadContainer = document.getElementById('pptx-download');
            downloadContainer.innerHTML = '';
            if (pptxBlob) {
                const pptxLink = Utils.createDownloadLink(pptxBlob, 'converted.pptx', 'Download PPTX');
                downloadContainer.appendChild(pptxLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to convert PDF to PPTX: ' + error.message);
            document.getElementById('pptx-loader').classList.remove('show');
        }
    }

    handleCompareFiles(file1, file2) {
        const button = document.getElementById('compare-btn');
        const label1 = document.querySelector('label[for="compare-input-1"] span');
        const label2 = document.querySelector('label[for="compare-input-2"] span');
        if (file1) label1.textContent = `Selected: ${file1.name}`;
        else label1.textContent = 'Choose First PDF';
        if (file2) label2.textContent = `Selected: ${file2.name}`;
        else label2.textContent = 'Choose Second PDF';
        button.disabled = !(file1 && file2);
    }

    async comparePdfs(file1, file2) {
        if (!file1 || !file2) return;
        try {
            const loader = document.getElementById('compare-loader');
            loader.classList.add('show');
            const { diffText, diffBlob } = await PdfService.comparePdfs(file1, file2);
            const resultsSection = document.getElementById('compare-results');
            const diffReport = document.getElementById('compare-diff-report');
            const downloadContainer = document.getElementById('compare-download');
            diffReport.innerHTML = '';
            downloadContainer.innerHTML = '';
            if (diffText) {
                diffReport.textContent = diffText;
            }
            if (diffBlob) {
                const diffLink = Utils.createDownloadLink(diffBlob, 'pdf-diff.txt', 'Download Diff Report');
                downloadContainer.appendChild(diffLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to compare PDFs: ' + error.message);
            document.getElementById('compare-loader').classList.remove('show');
        }
    }

    handleAudioFile(file) {
        this.audioFile = file;
        const button = document.getElementById('convert-audio-btn');
        const label = document.querySelector('label[for="audio-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    async convertToAudio() {
        if (!this.audioFile) return;
        try {
            const loader = document.getElementById('audio-loader');
            loader.classList.add('show');
            const audioBlob = await PdfService.pdfToAudio(this.audioFile);
            const resultsSection = document.getElementById('audio-results');
            const downloadContainer = document.getElementById('audio-download');
            const audioPlayer = document.getElementById('audio-player');
            downloadContainer.innerHTML = '';
            if (audioBlob) {
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayer.src = audioUrl;
                audioPlayer.style.display = 'block';
                const audioLink = Utils.createDownloadLink(audioBlob, 'pdf-audio.wav', 'Download Audio');
                downloadContainer.appendChild(audioLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to convert PDF to audio: ' + error.message);
            document.getElementById('audio-loader').classList.remove('show');
        }
    }

    async handleFormFillFile(file) {
        this.formFillFile = file;
        const button = document.getElementById('fill-form-btn');
        const label = document.querySelector('label[for="formfill-input"] span');
        button.disabled = true;
        label.textContent = `Selected: ${file.name}`;
        // Detect fields and render form
        const fieldsContainer = document.getElementById('formfill-fields');
        fieldsContainer.innerHTML = '<p>Detecting form fields...</p>';
        try {
            const fields = await PdfService.getPdfFormFields(file);
            this.renderFormFields(fields);
        } catch (error) {
            fieldsContainer.innerHTML = '<p>No fillable fields detected. (Overlay text not yet supported in MVP)</p>';
        }
    }

    renderFormFields(fields) {
        const fieldsContainer = document.getElementById('formfill-fields');
        fieldsContainer.innerHTML = '';
        if (!fields || fields.length === 0) {
            fieldsContainer.innerHTML = '<p>No fillable fields detected.</p>';
            return;
        }
        const form = document.createElement('form');
        form.id = 'formfill-dynamic-form';
        fields.forEach(field => {
            const div = document.createElement('div');
            div.className = 'metadata-field';
            const label = document.createElement('label');
            label.textContent = field.name;
            label.htmlFor = `formfill-field-${field.name}`;
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `formfill-field-${field.name}`;
            input.name = field.name;
            input.value = field.value || '';
            input.addEventListener('input', () => {
                document.getElementById('fill-form-btn').disabled = false;
            });
            div.appendChild(label);
            div.appendChild(input);
            form.appendChild(div);
        });
        fieldsContainer.appendChild(form);
        document.getElementById('fill-form-btn').disabled = false;
    }

    async fillForm() {
        if (!this.formFillFile) return;
        try {
            const loader = document.getElementById('formfill-loader');
            loader.classList.add('show');
            const form = document.getElementById('formfill-dynamic-form');
            const formData = {};
            if (form) {
                Array.from(form.elements).forEach(el => {
                    if (el.name) formData[el.name] = el.value;
                });
            }
            const filledBlob = await PdfService.fillPdfForm(this.formFillFile, formData);
            const resultsSection = document.getElementById('formfill-results');
            const downloadContainer = document.getElementById('formfill-download');
            downloadContainer.innerHTML = '';
            if (filledBlob) {
                const filledLink = Utils.createDownloadLink(filledBlob, 'filled-form.pdf', 'Download Filled PDF');
                downloadContainer.appendChild(filledLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to fill PDF form: ' + error.message);
            document.getElementById('formfill-loader').classList.remove('show');
        }
    }

    handlePageNumFile(file) {
        this.pageNumFile = file;
        const button = document.getElementById('add-pagenum-btn');
        const label = document.querySelector('label[for="pagenum-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    async addPageNumbers() {
        if (!this.pageNumFile) return;
        try {
            const loader = document.getElementById('pagenum-loader');
            loader.classList.add('show');
            const position = document.getElementById('pagenum-position').value;
            const align = document.getElementById('pagenum-align').value;
            const fontSize = parseInt(document.getElementById('pagenum-size').value) || 14;
            const startNum = parseInt(document.getElementById('pagenum-start').value) || 1;
            const numberedBlob = await PdfService.addPageNumbers(this.pageNumFile, { position, align, fontSize, startNum });
            const resultsSection = document.getElementById('pagenum-results');
            const downloadContainer = document.getElementById('pagenum-download');
            downloadContainer.innerHTML = '';
            if (numberedBlob) {
                const numLink = Utils.createDownloadLink(numberedBlob, 'numbered.pdf', 'Download PDF with Page Numbers');
                downloadContainer.appendChild(numLink);
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to add page numbers: ' + error.message);
            document.getElementById('pagenum-loader').classList.remove('show');
        }
    }

    handleHtmlFile(file) {
        this.htmlFile = file;
        const button = document.getElementById('convert-html-btn');
        const label = document.querySelector('label[for="html-input"] span');
        button.disabled = false;
        label.textContent = `Selected: ${file.name}`;
    }

    async convertToHtml() {
        if (!this.htmlFile) return;
        try {
            const loader = document.getElementById('html-loader');
            loader.classList.add('show');
            const { zipBlob, firstPageHtml } = await PdfService.pdfToHtml(this.htmlFile);
            const resultsSection = document.getElementById('html-results');
            const downloadContainer = document.getElementById('html-download');
            const previewContainer = document.getElementById('html-preview');
            downloadContainer.innerHTML = '';
            previewContainer.innerHTML = '';
            if (zipBlob) {
                const htmlLink = Utils.createDownloadLink(zipBlob, 'pdf-html.zip', 'Download HTML (ZIP)');
                downloadContainer.appendChild(htmlLink);
            }
            if (firstPageHtml) {
                previewContainer.innerHTML = firstPageHtml;
            }
            resultsSection.classList.add('show');
            loader.classList.remove('show');
        } catch (error) {
            Utils.showError('Failed to convert PDF to HTML: ' + error.message);
            document.getElementById('html-loader').classList.remove('show');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    // Ensure all results blocks are hidden on first load
    document.querySelectorAll('.results').forEach(r => r.classList.remove('show'));

    // Theme toggle
    const applyTheme = (t) => {
        document.body.classList.toggle('theme-dark', t === 'dark');
    };
    const saved = localStorage.getItem('ppc-theme') || 'light';
    applyTheme(saved);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            localStorage.setItem('ppc-theme', newTheme);
            applyTheme(newTheme);
        });
    }
});
