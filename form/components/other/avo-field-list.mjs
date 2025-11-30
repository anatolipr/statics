
customElements.define('avo-field-list', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // If already initialized, skip
        if (this._initialized) return;
        this._initialized = true;

        const children = Array.from(this.childNodes);

        this.innerHTML = `
        <div style="position: relative" class="field-list"></div>
        `;

        const placeholder = this.querySelector('div');
        placeholder.replaceChildren(...children);
    }
});