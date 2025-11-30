
customElements.define('avo-field-with-label', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // If already initialized, skip
        if (this._initialized) return;
        this._initialized = true;

        const children = Array.from(this.childNodes);

        this.innerHTML = `
        <div style="position: relative" class="field-with-label">
            <div class="label">Label</div>
            <div class="placeholder"></div>
        </div>
        `;

        this.querySelector('.label').textContent = this.getAttribute('label');
        const placeholder = this.querySelector('.placeholder');
        placeholder.replaceChildren(...children);

        
    }
});