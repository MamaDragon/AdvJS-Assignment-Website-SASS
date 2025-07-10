/**
 * @fileoverview Contact Assignment - WeakMap, Type Guards, and Proxy Implementation
 * Demonstrates advanced JavaScript features for form validation and data handling
 * @author Advanced JavaScript Assignment
 * @version 1.0.0
 */

/**
 * Contact Assignment - WeakMap, Type Guards, and Proxy Implementation
 * Demonstrates advanced JavaScript features for form validation and data handling
 * @namespace ContactModule
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// === WeakMap to store validation status privately ===
/** @type {WeakMap<HTMLFormElement, FormValidationMeta>} */
const formMeta = new WeakMap();

// === Type guards for form and input elements ===
/**
 * Type guard to check if an element is an HTMLFormElement
 * @param {Element | null} el - The element to check
 * @returns {boolean} True if element is a form
 */
function isForm(el) {
    return el instanceof HTMLFormElement;
}

/**
 * Type guard to check if an element is an HTMLInputElement
 * @param {Element | null} el - The element to check
 * @returns {boolean} True if element is an input
 */
function isInput(el) {
    return el instanceof HTMLInputElement;
}
// === Utility to safely get trimmed input values ===
/**
 * Safely retrieves and trims the value from an input element
 * @param {string} id - The ID of the input element
 * @returns {string} The trimmed value from the input
 * @throws {Error} If the element is not found or not an input
 */
function getInputValue(id) {
    const el = document.getElementById(id);
    if (!isInput(el))
        throw new Error(`Invalid input: ${id}`);
    return el.value.trim();
}

// === Proxy wrapper to log property access ===
/**
 * Creates a proxy wrapper around an object to log property access and modifications
 * @param {Object} obj - The object to wrap with a proxy
 * @returns {Object} A proxy of the original object with logging capabilities
 */
function createFormProxy(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            const value = Reflect.get(target, prop);
            console.log(`Accessed ${String(prop)}:`, value);
            return value;
        },
        set(target, prop, value) {
            console.log(`Set ${String(prop)} = ${value}`);
            return Reflect.set(target, prop, value);
        }
    });
}
// === DOM ready logic ===
document.addEventListener('DOMContentLoaded', () => {
    // === Grab the form and result message area ===
    const form = document.getElementById('myForm');
    const responseDiv = document.getElementById('response');
    // === Confirm the form and response div are found ===
    if (!isForm(form) || !responseDiv) {
        console.error('Missing form or response div');
        return;
    }
    // === Set up the submit event handler ===
    form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // === Store "not validated" in the WeakMap for this form ===
        formMeta.set(form, { validated: false });
        // === Wrap the user input data in a Proxy ===
        const inputs = createFormProxy({
            phone: getInputValue('phone'),
            email: getInputValue('email'),
            zip: getInputValue('zip')
        });
        // === Run validation on inputs ===
        const errors = [];
        if (!/^\d{10}$/.test(inputs.phone))
            errors.push('Phone must be 10 digits.');
        if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(inputs.email))
            errors.push('Invalid email format.');
        if (!/^\d{5}$/.test(inputs.zip))
            errors.push('Zip must be 5 digits.');
        // === Store validation result in WeakMap ===
        formMeta.set(form, { validated: errors.length === 0 });
        // === If there are errors, display them and stop ===
        if (errors.length > 0) {
            responseDiv.innerHTML = `<div class="alert alert-danger">${errors.join('<br>')}</div>`;
            return;
        }
        // === Submit the data if it's valid ===
        try {
            console.log('Form validation passed, preparing to save data...');
            
            // Create form submission data with timestamp
            const submissionData = {
                timestamp: new Date().toISOString(),
                phone: inputs.phone,
                email: inputs.email,
                zip: inputs.zip,
                id: Date.now() // Unique identifier
            };

            console.log('Submission data:', submissionData);

            // Save to localStorage
            console.log('Calling saveToLocalStorage...');
            saveToLocalStorage(submissionData);
            
            // Save to contacts.json file
            console.log('Calling saveToContactsFile...');
            yield saveToContactsFile(submissionData);
            
            console.log('Data saving completed successfully');
            
            // === Display success message ===
            responseDiv.innerHTML = `
                <div class="alert alert-success">
                    <h5>Form submitted successfully!</h5>
                    <p>Data has been saved to:</p>
                    <ul>
                        <li>Project contacts.json file</li>
                        <li>Browser localStorage</li>
                    </ul>
                    <div class="mt-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="downloadMySubmission('${submissionData.id}')">
                            Download My Submission
                        </button>
                    </div>
                    <small class="text-muted">Submission ID: ${submissionData.id}</small>
                </div>`;
        }
        catch (err) {
            console.error(err);
            responseDiv.innerHTML = `<div class="alert alert-danger">Submission failed. Try again.</div>`;
        }
    }));
});

/**
 * Saves form submission data to localStorage
 * @param {Object} submissionData - The form data to save
 */
function saveToLocalStorage(submissionData) {
    try {
        console.log('saveToLocalStorage called with:', submissionData);
        
        // Get existing submissions or initialize empty array
        const existingDataString = localStorage.getItem('contactSubmissions') || '[]';
        console.log('Existing data string from localStorage:', existingDataString);
        
        const existingData = JSON.parse(existingDataString);
        console.log('Parsed existing data:', existingData);
        
        // Add new submission
        existingData.push(submissionData);
        console.log('Data after adding new submission:', existingData);
        
        // Save back to localStorage
        const dataToSave = JSON.stringify(existingData);
        console.log('Saving to localStorage:', dataToSave);
        
        localStorage.setItem('contactSubmissions', dataToSave);
        
        // Verify it was saved
        const verifyData = localStorage.getItem('contactSubmissions');
        console.log('Verification - data in localStorage:', verifyData);
        
        console.log('Data saved to localStorage successfully:', submissionData);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

/**
 * Saves form submission data to contacts.json file
 * @param {Object} submissionData - The form data to save
 */
function saveToContactsFile(submissionData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('saveToContactsFile called with:', submissionData);
            
            // First, try to load existing contacts data
            let contactsData = { submissions: [] };
            try {
                const response = yield fetch('contacts.json');
                if (response.ok) {
                    contactsData = yield response.json();
                    console.log('Loaded existing contacts data:', contactsData);
                }
            } catch (error) {
                console.log('No existing contacts file found, creating new one');
            }
            
            // Add new submission
            contactsData.submissions.push(submissionData);
            console.log('Updated contacts data:', contactsData);
            
            // Note: In a real application, you'd need a backend to write to files
            // For now, we'll simulate this by updating localStorage with the file structure
            localStorage.setItem('contactsFileData', JSON.stringify(contactsData));
            
            console.log('Data saved to contacts file structure successfully');
            
            // Also create a downloadable backup
            const jsonString = JSON.stringify(contactsData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Store the download URL for later use
            localStorage.setItem('contactsFileDownloadUrl', url);
            
        } catch (error) {
            console.error('Failed to save to contacts file:', error);
            throw error;
        }
    });
}

/**
 * Downloads a specific submission by ID
 * @param {string} submissionId - The ID of the submission to download
 */
function downloadMySubmission(submissionId) {
    try {
        const submissions = getSavedSubmissions();
        const submission = submissions.find(s => s.id.toString() === submissionId);
        
        if (!submission) {
            alert('Submission not found!');
            return;
        }
        
        downloadAsJSON(submission);
    } catch (error) {
        console.error('Failed to download submission:', error);
        alert('Failed to download submission. Please try again.');
    }
}

/**
 * Downloads the entire contacts.json file
 */
function downloadContactsFile() {
    try {
        const contactsData = JSON.parse(localStorage.getItem('contactsFileData') || '{"submissions":[]}');
        
        if (contactsData.submissions.length === 0) {
            alert('No contact submissions found.');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `contacts-${timestamp}.json`;
        
        const jsonString = JSON.stringify(contactsData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
        
        console.log(`Downloaded contacts file: ${filename}`);
        alert(`Downloaded ${contactsData.submissions.length} contact submissions successfully!`);
    } catch (error) {
        console.error('Failed to download contacts file:', error);
        alert('Failed to download contacts file. Please try again.');
    }
}

/**
 * Downloads form data as a JSON file
 * @param {Object} submissionData - The form data to download
 */
function downloadAsJSON(submissionData) {
    try {
        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `contact-submission-${timestamp}.json`;
        
        // Create blob with JSON data
        const jsonString = JSON.stringify(submissionData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up URL object
        URL.revokeObjectURL(url);
        
        console.log('JSON file downloaded:', filename);
    } catch (error) {
        console.error('Failed to download JSON file:', error);
    }
}

/**
 * Retrieves all saved contact submissions from localStorage
 * @returns {Array} Array of saved submissions
 */
function getSavedSubmissions() {
    try {
        return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    } catch (error) {
        console.error('Failed to retrieve saved submissions:', error);
        return [];
    }
}

/**
 * Displays all saved submissions in the UI
 */
function showSavedSubmissions() {
    console.log('showSavedSubmissions called');
    
    try {
        const submissions = getSavedSubmissions();
        console.log('Retrieved submissions:', submissions);
        
        const container = document.getElementById('savedSubmissions');
        console.log('Container element:', container);
        
        if (!container) {
            console.error('Container element not found!');
            return;
        }
        
        if (submissions.length === 0) {
            container.innerHTML = '<p class="text-muted">No saved submissions found.</p>';
            console.log('No submissions found, displaying empty message');
            return;
        }
        
        console.log(`Displaying ${submissions.length} submissions`);
        
        const submissionsHtml = submissions.map((submission, index) => `
            <div class="card mb-2">
                <div class="card-body">
                    <h6 class="card-title">Submission #${index + 1}</h6>
                    <p class="card-text">
                        <strong>Date:</strong> ${new Date(submission.timestamp).toLocaleString()}<br>
                        <strong>Phone:</strong> ${submission.phone}<br>
                        <strong>Email:</strong> ${submission.email}<br>
                        <strong>ZIP:</strong> ${submission.zip}<br>
                        <small class="text-muted">ID: ${submission.id}</small>
                    </p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="mt-3">
                <h6>Saved Submissions (${submissions.length})</h6>
                ${submissionsHtml}
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="clearSavedSubmissions()">
                    Clear All Data
                </button>
            </div>
        `;
        
        console.log('Submissions display updated successfully');
        
    } catch (error) {
        console.error('Error in showSavedSubmissions:', error);
        const container = document.getElementById('savedSubmissions');
        if (container) {
            container.innerHTML = '<p class="text-danger">Error loading saved submissions. Please refresh the page.</p>';
        }
    }
}

/**
 * Downloads all saved submissions as a single JSON file
 */
function downloadAllSubmissions() {
    const submissions = getSavedSubmissions();
    
    if (submissions.length === 0) {
        alert('No saved submissions to download.');
        return;
    }
    
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `all-contact-submissions-${timestamp}.json`;
        
        const jsonString = JSON.stringify({
            exportDate: new Date().toISOString(),
            totalSubmissions: submissions.length,
            submissions: submissions
        }, null, 2);
        
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
        
        console.log(`Downloaded ${submissions.length} submissions as ${filename}`);
        alert(`Downloaded ${submissions.length} submissions successfully!`);
    } catch (error) {
        console.error('Failed to download all submissions:', error);
        alert('Failed to download submissions. Please try again.');
    }
}

/**
 * Clears all saved submissions from localStorage
 */
function clearSavedSubmissions() {
    if (confirm('Are you sure you want to delete all saved submissions? This cannot be undone.')) {
        try {
            console.log('Clearing all saved data...');
            
            // Clear localStorage data
            localStorage.removeItem('contactSubmissions');
            localStorage.removeItem('contactsFileData');
            localStorage.removeItem('contactsFileDownloadUrl');
            
            console.log('All localStorage data cleared');
            
            // Clear the display immediately
            const container = document.getElementById('savedSubmissions');
            if (container) {
                container.innerHTML = '<p class="text-muted">No saved submissions found.</p>';
            }
            
            // Show success message
            console.log('All saved submissions cleared successfully');
            alert('All saved submissions have been cleared.');
            
            // Optional: Refresh the display after a short delay to ensure proper update
            setTimeout(() => {
                showSavedSubmissions();
            }, 100);
            
        } catch (error) {
            console.error('Error clearing submissions:', error);
            alert('Error clearing submissions. Please refresh the page and try again.');
        }
    }
}

// === Make functions globally accessible ===
window.showSavedSubmissions = showSavedSubmissions;
window.downloadAllSubmissions = downloadAllSubmissions;
window.clearSavedSubmissions = clearSavedSubmissions;
window.downloadMySubmission = downloadMySubmission;
window.downloadContactsFile = downloadContactsFile;
