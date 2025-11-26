import { defineElementsWithDataId } from "../rand/util.mjs";
import { CondtionModel } from "./form-models.mjs";

customElements.define('avo-form-test', class extends HTMLElement {
    constructor() {
        super();
    }

    model = new CondtionModel();

    connectedCallback() {
        this.innerHTML = `
            fieldName
            <input data-id="fieldName"><br>
            expectedValue
            <input data-id="requiredValue">
        `;

        defineElementsWithDataId(this);

        this.model.addEventListener('fieldNameSet', (e) => {
            this.fieldNameEl.value = e.detail;
        });

        this.model.addEventListener('requiredValueSet', (e) => {
            this.requiredValueEl.value = e.detail;
        });

        this.fieldNameEl.addEventListener('input', e => this.model.fieldName = e.target.value);
        this.requiredValueEl.addEventListener('input', e => this.model.requiredValue = e.target.value);
        
    }
})