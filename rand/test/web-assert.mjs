import { diffChars, diffJson } from "https://cdn.jsdelivr.net/npm/diff@5.1.0/+esm";

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
    .web-assert {
        background: var(--assert-bg); 
        color: var(--assert-text); 
        font-family: monospace; 
        padding: 5px; 
        border-radius: 4px;

        --assert-bg: light-dark(#f5f5f5, #222);
        --assert-text: light-dark(black, white);
        --assert-add: light-dark(#b7ffb7, #005f00);
        --assert-remove: light-dark(#ffb7b7, #5f0000);

        .diff {
            background: var(--assert-bg); 
            color: var(--assert-text); 
            font-family: monospace; 
            display: inline-block; 
            border-radius: 4px;

            .part {
                display: inline-block;
                margin: 0; 
                border-radius: 3px;
            }
        }
    }
    .success {
        color: light-dark(#008f00, #00f900);
    }
    
    .fail {
        color: light-dark(#941100, #ff2600);
    }
`);

document.adoptedStyleSheets = [sheet];

class WebAssert extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const expression = this.getAttribute("expression");
        const expectedRaw = this.getAttribute("expected");
        const message = this.getAttribute("message");
        const contextName = this.getAttribute("context");
        const operator = this.getAttribute("is") || '==';

        let context = window[contextName] || {}; // Get functions if provided
        let result, expected;

        try {
            expected = JSON.parse(expectedRaw); // Convert to number/object/boolean if possible
        } catch {
            expected = expectedRaw;
        }

        try {
            result = new Function(...Object.keys(context), `return (${expression})`)(...Object.values(context));
        } catch (error) {
            result = `Error: ${error.message}`;
        }


        let isSuccess;
        switch (operator) {
            case "==":
                isSuccess = result == expected;
                break;
            case "!=":
                isSuccess = result != expected;
                break;
            case "===":
                isSuccess = result === expected;
                break;
            case "!==":
                isSuccess = result !== expected;
                break;
            case "<":
                isSuccess = result < expected;
                break;
            case ">":
                isSuccess = result > expected;
                break;
            case "in":
                isSuccess = expected.indexOf(result) > -1;
                break;
            case "not in":
                isSuccess = expected.indexOf(result) === -1;
                break;
        }

        let diffHTML = "";
        if (!isSuccess) {
            if (typeof expected === "object" || typeof result === "object") {
                diffHTML = this.formatDiff(diffJson(expected, result));
            } else {
                diffHTML = this.formatDiff(diffChars(String(expected), String(result)));
            }
        }

        this.innerHTML = `
            <div class="web-assert ${isSuccess ? 'success' : 'fail'}">
            <h2>${message}</h2><br>
                ${isSuccess 
                    ? `✔️ ${expression} ${operator} ${result} (${message})`
                    : `❌ ${expression} ${operator} <br> 
                       <strong>Expected:</strong> ${expected} <br> 
                       <strong>Actual:</strong> ${result} <br> 
                       ${diffHTML}`}
            </div>
        `;
    }

    formatDiff(diffs) {
        return `<strong>Difference:</strong> <div class="diff">
            ${diffs.map(part =>
                `<span class="part" style="background: ${part.added ? 'var(--assert-add)' : part.removed ? 'var(--assert-remove)' : 'transparent'};">
                    ${part.value.replace(/\n/g, "<br>").trim()}
                </span>`
            ).join("")}
        </div>`;
    }
}

customElements.define("web-assert", WebAssert);
