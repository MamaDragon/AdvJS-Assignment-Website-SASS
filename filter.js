/**
 * @fileoverview Search filter module using RxJS for table row filtering.
 * Implements debounced search functionality with case-insensitive matching.
 * @author Advanced JavaScript Assignment
 * @version 1.0.0
 * @requires rxjs
 */

/**
 * Search filter module using RxJS for table row filtering.
 * Implements debounced search functionality with case-insensitive matching.
 * @namespace FilterModule
 */
import { fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
/** @type {HTMLInputElement | null} */
const input = document.getElementById('search');
/** @type {NodeListOf<HTMLTableRowElement>} */
const rows = document.querySelectorAll('#infoTable tbody tr');
/**
 * Filters table rows based on search value.
 * Shows or hides rows depending on whether their text content includes the search term.
 * @param {string} value - The search term to filter by (case-insensitive)
 * @returns {void}
 */
function filterRows(value) {
    rows.forEach(row => {
        var _a;
        const text = ((_a = row.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        row.style.display = text.includes(value) ? '' : 'none';
    });
}
if (input) {
    fromEvent(input, 'input').pipe(map(e => e.target.value.toLowerCase()), debounceTime(300), distinctUntilChanged()).subscribe(filterRows);
}
else {
    console.error('Search input not found.');
}
