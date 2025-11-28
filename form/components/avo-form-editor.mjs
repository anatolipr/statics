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

            <pre id="log">cc</pre>
        `;

        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];
        const pairInput = this.shadowRoot.querySelector('avo-pair-input');
        pairInput.model = new CondtionModel(); 

        pairInput.addEventListener('input', e => {
            this.shadowRoot.getElementById("log").innerHTML = 
                JSON.stringify(pairInput.model, null, ' ');
        });
    }

});