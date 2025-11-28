import './avo-pair-input.mjs'
import { CondtionModel } from "../form-models.mjs";

const css = await fetch(import.meta.resolve('./avo-form-editor.css'))
.then(r => r.text());

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);

customElements.define('avo-form-editor', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({'mode': 'open'});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <avo-pair-input
             fields="fieldName, requiredValue"
             placeholders="field name, required value"
            ></avo-pair-input>
        `;
        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];
        this.shadowRoot.querySelector('avo-form-condition').model = new CondtionModel(); 
    }

});