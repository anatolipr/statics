import { bindModelToInputs } from "../../../rand/util.mjs";
import "./avo-section-editor.mjs";

customElements.define('avo-sections-list', class extends HTMLElement {
    
    #value;

    set value(value) {
        this.#value = value;
        this.render();
        this.addModelListeners();
    }

    get value() {
        return this.#value;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        this.innerHTML = `
        <div class="repeater">
            <section class="section">
                <span class="remove"> remove </span>
                <avo-section-editor></avo-section-editor>
            </section>
        </div>
        <button class="add">add</button>
        `;

        //template
        this.repeaterEl = this.querySelector('.repeater');
        const section = this.querySelector('.section');
        this.sectionEl = section.cloneNode(true);

        //add button
        this.querySelector('.add').addEventListener('click', e => {
            if (!this.#value) return;
            this.#value.add();
        });

        this.render();
        this.addModelListeners();
    }

    addModelListeners() {
        if (!this.#value) return;
        this.#value.addEventListener('added', (e) => {
            if (!this._initialized) return;
            this.add(e.detail);
        });

        this.#value.addEventListener('removed', (e) => {
            this.repeaterEl.childNodes[e.detail].remove();
        });
    }

    render() {
        if (!this._initialized) return;
        if (!this.#value) return;
        this.repeaterEl.replaceChildren(... this.value.list.map(value =>
            this.getNewSection(value)
        ));
    }

    add(value) {
        this.repeaterEl.appendChild(this.getNewSection(value));
    }

    getNewSection(value) {
        const section = this.sectionEl.cloneNode(true);
        section.querySelector('avo-section-editor').value = value;
        section.querySelector('.remove').addEventListener('click', (e) => {
            const idx = Array.from(this.repeaterEl.children).indexOf(section);
            this.value.remove(idx);
        });
        return section;
    }

});