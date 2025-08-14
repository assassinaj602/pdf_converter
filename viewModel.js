/**
 * ViewModel - State management with observable pattern
 */

class ViewModel {
    constructor() {
        this.state = {
            selectedPdf: null,
            selectedImages: [],
            isLoading: false,
            resultBlobs: [],
            activeTab: 'pdf-to-images',
            error: null
        };
        
        this.observers = [];
    }

    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    /**
     * Notify all observers of state change
     */
    notify(changedProperty) {
        this.observers.forEach(callback => callback(this.state, changedProperty));
    }

    /**
     * Update state and notify observers
     */
    setState(updates) {
        const changedProperties = [];
        
        for (const [key, value] of Object.entries(updates)) {
            if (this.state[key] !== value) {
                this.state[key] = value;
                changedProperties.push(key);
            }
        }
        
        if (changedProperties.length > 0) {
            changedProperties.forEach(prop => this.notify(prop));
        }
    }

    /**
     * Set selected PDF file
     */
    setSelectedPdf(file) {
        this.setState({ 
            selectedPdf: file,
            resultBlobs: [],
            error: null
        });
    }

    /**
     * Set selected image files
     */
    setSelectedImages(files) {
        this.setState({ 
            selectedImages: Array.from(files),
            resultBlobs: [],
            error: null
        });
    }

    /**
     * Set loading state
     */
    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    /**
     * Set result blobs
     */
    setResultBlobs(blobs) {
        this.setState({ resultBlobs: blobs });
    }

    /**
     * Set active tab
     */
    setActiveTab(tab) {
        this.setState({ 
            activeTab: tab,
            selectedPdf: null,
            selectedImages: [],
            resultBlobs: [],
            error: null
        });
    }

    /**
     * Set error
     */
    setError(error) {
        this.setState({ error });
    }

    /**
     * Clear error
     */
    clearError() {
        this.setState({ error: null });
    }

    /**
     * Convert PDF to images
     */
    async convertPdfToImages() {
        if (!this.state.selectedPdf) return;

        try {
            this.setLoading(true);
            this.clearError();
            // Options from UI
            const scaleSel = document.getElementById('img-scale');
            const fmtSel = document.getElementById('img-format');
            const scale = scaleSel ? parseFloat(scaleSel.value) : 2.0;
            const fmt = fmtSel ? fmtSel.value : 'png';
            const imageBlobs = await PdfService.pdfFileToImages(this.state.selectedPdf, scale, fmt);
            this.setResultBlobs(imageBlobs);
        } catch (error) {
            this.setError(error.message);
            Utils.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Convert images to PDF
     */
    async convertImagesToPdf() {
        if (this.state.selectedImages.length === 0) return;

        try {
            this.setLoading(true);
            this.clearError();
            const sizeSel = document.getElementById('pdf-page-size');
            const orientSel = document.getElementById('pdf-orientation');
            const options = {
                format: sizeSel ? sizeSel.value : 'a4',
                orientation: orientSel ? orientSel.value : 'portrait'
            };
            const pdfBlob = await PdfService.imageFilesToPdf(this.state.selectedImages, options);
            this.setResultBlobs([pdfBlob]);
        } catch (error) {
            this.setError(error.message);
            Utils.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
}
