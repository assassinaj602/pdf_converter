/**
 * Utility functions for PDF operations
 */

const Utils = {
    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 5000);
        } else {
            // Fallback to alert if error element not found
            alert('Error: ' + message);
        }
    },
    
    /**
     * Validate file type
     */
    validateFileType(file, types) {
        if (!file) return false;
        
        if (types.includes('pdf') && file.type === 'application/pdf') {
            return true;
        }
        
        if (types.includes('image') && file.type.startsWith('image/')) {
            return true;
        }
        
        return false;
    },
    
    /**
     * Create preview image for file
     */
    createPreviewImage(fileOrBlob, title) {
        const container = document.createElement('div');
        container.className = 'preview-item';
        
        const img = document.createElement('img');
        img.alt = title || 'Preview';
        
        if (fileOrBlob instanceof Blob) {
            img.src = URL.createObjectURL(fileOrBlob);
        } else {
            img.src = URL.createObjectURL(fileOrBlob);
        }
        
        // Clean up object URL when image loads
        img.onload = () => {
            setTimeout(() => URL.revokeObjectURL(img.src), 1000);
        };
        
        container.appendChild(img);
        
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.textContent = title || 'Preview';
        container.appendChild(overlay);
        
        return container;
    },
    
    /**
     * Create download link with improved styling and icons
     */
    createDownloadLink(blob, filename, text) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.className = 'download-btn';
        
        // Add appropriate icon based on file type
        let icon = '⬇️';
        if (filename.endsWith('.pdf')) {
            icon = '📄';
        } else if (filename.endsWith('.txt')) {
            icon = '📝';
        } else if (filename.endsWith('.zip')) {
            icon = '📦';
        } else if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)) {
            icon = '🖼️';
        } else if (filename.endsWith('.xlsx')) {
            icon = '📊';
        } else if (filename.endsWith('.csv')) {
            icon = '📋';
        } else if (filename.endsWith('.pptx')) {
            icon = '📑';
        } else if (filename.endsWith('.wav') || filename.endsWith('.mp3')) {
            icon = '🔊';
        } else if (filename.endsWith('.html')) {
            icon = '🌐';
        }
        
        link.innerHTML = `${icon} ${text || `Download ${filename}`}`;
        
        // Clean up object URL after download
        link.addEventListener('click', function() {
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        });
        
        return link;
    },
    
    /**
     * Format file size with appropriate units
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    /**
     * Create badge for premium features
     */
    createPremiumBadge() {
        const badge = document.createElement('span');
        badge.className = 'premium-badge';
        badge.textContent = 'Premium';
        return badge;
    },
    
    /**
     * Create text preview with sample data
     */
    createTextPreview(text, maxLength = 500) {
        const preview = document.createElement('div');
        preview.className = 'text-preview';
        
        const heading = document.createElement('h4');
        heading.textContent = 'Text Preview';
        
        const preElement = document.createElement('pre');
        // Truncate long text
        preElement.textContent = text.length > maxLength ? 
            text.substring(0, maxLength) + '...' : 
            text;
        
        preview.appendChild(heading);
        preview.appendChild(preElement);
        
        return preview;
    },

    /**
     * Show success message
     */
    showSuccess(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            errorElement.classList.add('show');
            
            setTimeout(() => {
                errorElement.classList.remove('show');
                errorElement.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            }, 3000);
        }
    },

    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if browser supports required features
     */
    checkBrowserSupport() {
        const features = {
            FileReader: typeof FileReader !== 'undefined',
            Blob: typeof Blob !== 'undefined',
            Canvas: typeof HTMLCanvasElement !== 'undefined',
            Worker: typeof Worker !== 'undefined'
        };

        const unsupported = Object.entries(features)
            .filter(([name, supported]) => !supported)
            .map(([name]) => name);

        if (unsupported.length > 0) {
            this.showError(`Your browser doesn't support: ${unsupported.join(', ')}. Please use a modern browser.`);
            return false;
        }

        return true;
    },

    /**
     * Convert bytes to human readable format
     */
    humanFileSize(bytes, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;
        
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        
        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
        
        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
        
        return bytes.toFixed(dp) + ' ' + units[u];
    }
};

// Initialize browser support check when utils load
document.addEventListener('DOMContentLoaded', () => {
    Utils.checkBrowserSupport();
});
