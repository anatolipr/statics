import './other/avo-pair-input.mjs'
import './other/avo-field-with-label.mjs'
import './other/avo-field-list.mjs'
import './section/avo-section-repeater.mjs'

import { FormModel } from "../form-models.mjs";
import { bindModelToInputs } from '../../rand/util.mjs';

const css = await fetch(import.meta.resolve('./avo-form-editor.css'))
.then(r => r.text());

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);

customElements.define('avo-form-editor', class extends HTMLElement {
    
    #value;

    set value(value) {
        if (this.#value) {
            Object.assign(this.#value, value);
        } else {
            this.#value = value;
            bindModelToInputs(this, this.#value);
        }
    }

    get value() {
        return this.#value;
    }

    constructor() {
        super();
        this.attachShadow({'mode': 'open'});
    }

    connectedCallback() {

        if (this._initialized) return;
        this._initialized = true;

        this.shadowRoot.innerHTML = `
            
            <avo-field-list>

                <avo-field-with-label label="ID">
                    <input type="text" data-id="id">
                </avo-field-with-label>
                <avo-field-with-label label="Title">
                    <input type="text" data-id="title">
                </avo-field-with-label>
                <avo-field-with-label label="Description">
                    <input type="text" data-id="description">
                </avo-field-with-label>

                <avo-field-with-label label="Sections">
                    <avo-section-repeater data-id="sections">
                        <h1>section</h1>
                    </avo-section-repeater>
                </avo-field-with-label>

                <avo-field-with-label label="CSS">
                    <textarea data-id="css"></textarea>
                </avo-field-with-label>

            </avo-field-list>
            
        `;

        this.shadowRoot.adoptedStyleSheets = [ stylesheet ];


        const existing = new FormModel();
        existing.id = "123";
        existing.sections = [
            {
                id: '123', title: 'foo'
            },
            {
                id: '321', title: 'abc'
            },
            {
                id: '111', title: 'bar'
            },
        ]

        this.value = existing;

    }

});