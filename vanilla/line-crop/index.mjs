try {
    customElements.define('avo-line-crop', class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.style.overflow = 'hidden';
            this.style.display = '-webkit-box';
            this.style.webkitBoxOrient = 'vertical';
            this.style.webkitLineClamp = this.getAttribute('lines') || 2;
        }
    })
} catch(e) {
    //likely already defined
    console.error(е);
}