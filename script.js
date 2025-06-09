/**
 * Boolean Minimizer using Quine-McCluskey-Tabulian Method
 * Designed by Yassin Khaled, Group 1, Section 1 **ID: 9610**
 */

class BooleanMinimizer {
    constructor(vars, minterms, dontcares = []) {
        this.vars = vars;
        this.allTerms = [...new Set([...minterms, ...dontcares])];
        this.minterms = [...new Set(minterms)];
        this.dontcares = [...new Set(dontcares)];
    }

    toBinary(n) { 
        return n.toString(2).padStart(this.vars, '0'); 
    }
    
    countOnes(bin) { 
        return (bin.match(/1/g) || []).length; 
    }

    canCombine(a, b) {
        let diff = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                if (a[i] === '-' || b[i] === '-') return false;
                if (++diff > 1) return false;
            }
        }
        return diff === 1;
    }

    combine(a, b) {
        return a.split('').map((c, i) => c === b[i] ? c : '-').join('');
    }

    generatePrimeImplicants() {
        if (!this.allTerms.length) return [];

        let terms = this.allTerms.map(n => ({
            dec: [n],
            bin: this.toBinary(n),
            used: false
        }));

        let primes = [];

        while (true) {
            let groups = {};
            terms.forEach(t => {
                const ones = this.countOnes(t.bin);
                (groups[ones] = groups[ones] || []).push(t);
            });

            let newTerms = [];
            let combined = false;

            Object.keys(groups).sort((a, b) => a - b).forEach((key, i, keys) => {
                if (i < keys.length - 1) {
                    const curr = groups[key];
                    const next = groups[keys[i + 1]];

                    curr.forEach(t1 => {
                        next.forEach(t2 => {
                            if (this.canCombine(t1.bin, t2.bin)) {
                                const newBin = this.combine(t1.bin, t2.bin);
                                const newDec = [...new Set([...t1.dec, ...t2.dec])].sort((a, b) => a - b);

                                if (!newTerms.some(nt => nt.bin === newBin &&
                                    nt.dec.length === newDec.length &&
                                    nt.dec.every((v, i) => v === newDec[i]))) {
                                    newTerms.push({ dec: newDec, bin: newBin, used: false });
                                    combined = true;
                                }
                                t1.used = t2.used = true;
                            }
                        });
                    });
                }
            });

            primes.push(...terms.filter(t => !t.used));
            if (!combined) break;
            terms = newTerms;
        }

        return primes;
    }

    findEssential(primes) {
        let essential = [];
        this.minterms.forEach(m => {
            const covering = primes.filter(p => p.dec.includes(m));
            if (covering.length === 1 && !essential.includes(covering[0])) {
                essential.push(covering[0]);
            }
        });
        return essential;
    }

    findMinimalCover(primes) {
        const essential = this.findEssential(primes);
        let covered = new Set(essential.flatMap(p => p.dec.filter(d => this.minterms.includes(d))));

        if (covered.size === this.minterms.length) return essential;

        let remaining = this.minterms.filter(m => !covered.has(m));
        let selected = [...essential];
        let candidates = primes.filter(p => !essential.includes(p) &&
            p.dec.some(d => remaining.includes(d)));

        while (remaining.length && candidates.length) {
            let best = candidates.reduce((a, b) =>
                b.dec.filter(d => remaining.includes(d)).length >
                    a.dec.filter(d => remaining.includes(d)).length ? b : a);

            selected.push(best);
            best.dec.forEach(d => {
                if (this.minterms.includes(d)) {
                    remaining = remaining.filter(r => r !== d);
                }
            });
            candidates.splice(candidates.indexOf(best), 1);
        }

        return selected;
    }

    toAlgebraic(bin, vars) {
        return bin.split('').map((bit, i) =>
            bit === '1' ? vars[i] : bit === '0' ? vars[i] + "'" : ''
        ).filter(x => x).join('') || '1';
    }
}

// Utility Functions
function generateVariableNames(count) {
    const names = [];
    for (let i = 0; i < Math.min(count, 26); i++) {
        names.push(String.fromCharCode(65 + i));
    }
    if (count > 26) {
        let baseIndex = 0;
        for (let i = 26; i < count; i++) {
            const base = String.fromCharCode(65 + (baseIndex % 26));
            const suffix = Math.floor(baseIndex / 26);
            names.push(base + suffix);
            baseIndex++;
        }
    }
    return names;
}

function updateVariableNames() {
    const count = parseInt(document.getElementById('vars').value) || 3;
    const names = generateVariableNames(count);
    document.getElementById('names').value = names.join(' ');

    // Update max values info
    const maxTerms = Math.pow(2, count) - 1;
    document.getElementById('minterms').placeholder =
        count <= 4 ? `0,1,3,7 (max: ${maxTerms})` : `example: 0,1,5,30 (max: ${maxTerms})`;
    document.getElementById('dontcares').placeholder =
        count <= 4 ? `2,5 (max: ${maxTerms})` : `example: 2,4,31 (max: ${maxTerms})`;
}

// Main Calculation Function
function calculate() {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = '';

    try {
        const vars = parseInt(document.getElementById('vars').value);
        const names = generateVariableNames(vars);
        
        // Parse minterms
        const mintermStr = document.getElementById('minterms').value.trim();
        const minterms = mintermStr ? mintermStr.split(',')
            .map(x => parseInt(x.trim())).filter(x => !isNaN(x)) : [];
        
        // Parse don't cares
        const dontcareStr = document.getElementById('dontcares').value.trim();
        const dontcares = dontcareStr ? dontcareStr.split(',')
            .map(x => parseInt(x.trim())).filter(x => !isNaN(x)) : [];

        // Validation
        if (vars < 2) throw new Error('Need at least 2 variables');
        if (vars > 10) throw new Error('Maximum 10 variables supported for performance');
        if (!minterms.length) throw new Error('Enter at least one minterm');

        const maxTerm = Math.pow(2, vars) - 1;
        const invalidTerms = [...minterms, ...dontcares].filter(t => t < 0 || t > maxTerm);
        if (invalidTerms.length) {
            throw new Error(`Invalid terms: ${invalidTerms.join(',')}. Range: 0-${maxTerm}`);
        }

        // Check for overlapping terms
        const overlap = minterms.filter(m => dontcares.includes(m));
        if (overlap.length) {
            throw new Error(`Terms cannot be both minterms and don't cares: ${overlap.join(',')}`);
        }

        const qm = new BooleanMinimizer(vars, minterms, dontcares);
        const primes = qm.generatePrimeImplicants();
        const essential = qm.findEssential(primes);
        const minimal = qm.findMinimalCover(primes);

        displayResults(qm, names, primes, essential, minimal);
    } catch (e) {
        errorDiv.textContent = e.message;
        console.error('Calculation error:', e);
    }
}

// Results Display Function
function displayResults(qm, names, primes, essential, minimal) {
    const results = document.getElementById('results');
    results.style.display = 'block';

    let html = `
        <div class="result-section">
            <h2>Results</h2>
            <p><strong>Variables:</strong> ${names.join(', ')}</p>
            <p><strong>Minterms:</strong> Σm(${qm.minterms.join(',')})</p>
            <p><strong>Don't Cares:</strong> ${qm.dontcares.length ? 'Σd(' + qm.dontcares.join(',') + ')' : 'None'}</p>
            <p><strong>Prime Implicants:</strong> ${primes.length}</p>
        </div>`;

    if (primes.length) {
        html += `
            <div class="result-section">
                <h3>All Prime Implicants</h3>
                <table>
                    <tr><th>Covers</th><th>Binary</th><th>Expression</th><th>Type</th></tr>`;

        primes.forEach(p => {
            const isEss = essential.includes(p);
            html += `<tr ${isEss ? 'class="essential"' : ''}>
                <td>${p.dec.join(',')}</td>
                <td>${p.bin}</td>
                <td>${qm.toAlgebraic(p.bin, names)}</td>
                <td>${isEss ? 'Essential' : 'Non-Essential'}</td>
            </tr>`;
        });

        html += '</table></div>';

        if (minimal.length) {
            const expr = minimal.map(p => qm.toAlgebraic(p.bin, names)).join(' + ');
            html += `
                <div class="result-section">
                    <h3>Minimized Expression</h3>
                    <div class="minimized">F(${names.join(',')}) = ${expr}</div>
                </div>`;
        }
    } else {
        html += '<div class="result-section"><p style="color:#dc2626">No prime implicants found</p></div>';
    }

    results.innerHTML = html;
}

// Form Management Functions
function clearForm() {
    // Clear all input fields
    document.getElementById('vars').value = 3;
    document.getElementById('minterms').value = '';
    document.getElementById('dontcares').value = '';
    
    // Clear all display elements
    document.getElementById('m-sum').textContent = '()';
    document.getElementById('d-sum').textContent = '()';
    document.getElementById('error').textContent = '';
    
    // Hide results section
    const results = document.getElementById('results');
    results.style.display = 'none';
    results.innerHTML = '';
    
    // Update variable names and placeholders
    updateVariableNames();
    
    // Force focus away from any input to ensure clean state
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

// Sample Data Function (for testing)
function loadSample() {
    document.getElementById('vars').value = 4;
    document.getElementById('minterms').value = '0,1,3,7,15';
    document.getElementById('dontcares').value = '2,5';
    updateVariableNames();
    document.getElementById('m-sum').textContent = '(0,1,3,7,15)';
    document.getElementById('d-sum').textContent = '(2,5)';
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variable names
    updateVariableNames();
    
    // Add event listeners
    document.getElementById('vars').addEventListener('input', updateVariableNames);
    
    // Event handlers for sum display
    document.getElementById('minterms').addEventListener('input', function(e) {
        document.getElementById('m-sum').textContent =
            `(${e.target.value.split(',').map(x => x.trim()).filter(x => x).join(',')})`;
    });

    document.getElementById('dontcares').addEventListener('input', function(e) {
        document.getElementById('d-sum').textContent =
            `(${e.target.value.split(',').map(x => x.trim()).filter(x => x).join(',')})`;
    });
    
    console.log('Boolean Minimizer initialized successfully');
});