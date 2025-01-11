/**
 * 
 * @param {Event} event 
 * @returns { any }
 */
export function getInputValue(event) {

    const target = /** @type {HTMLElement} */ (event.target);
    let result;
    if (target === null) {
      throw new Error();
    }
    
    if (target instanceof HTMLInputElement) {
        if (target.type === 'checkbox') {
            if (!target.getAttribute('value')) {
                result = target.checked;
            } else if (!target.getAttribute('name')) {
                result = target.checked ? target.value : undefined;
            } else {
                result = [];
                
                (target.closest('form') || document.body)
                .querySelectorAll(`input[type='checkbox']`)
                .forEach( (checkbox) => {
                  
                    if (checkbox.name === target.name && checkbox.checked) {
                        result.push(checkbox.value);
                    } 
                })
            }
        } else {
            result = target.value;
        }
    } else if (target instanceof HTMLTextAreaElement) {
        result = target.value;
    } else if (target.contentEditable === 'true') {
        result = target.innerHTML;
    } else {
        //all other inputs, including custom elements
        result = /** @type { HTMLInputElement } */ (target).value;
    }
  
    return result;
  }
  
  /**
   * 
   * @param {HTMLElement} el 
   * @param {string} nv 
   * @returns 
   */
  export function updateElementValue(el, nv) {
    if (document.activeElement === el) {
        return;
    }
    if (el.dataset.value) {
        if (el instanceof HTMLInputElement) {
            if (el.type === 'checkbox') {
                el.checked = Boolean(nv);
            } else {
                el.value = nv;
            }
        } else if ( el instanceof HTMLSelectElement) {
          el.value = nv;
        } else {
            el.innerHTML = nv;
        }
    }
  }