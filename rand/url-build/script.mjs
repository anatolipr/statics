import { DomPuppet } from 'https://cdn.jsdelivr.net/gh/anatolipr/statics@v7/_/puppet.mjs';


new DomPuppet({
  el: document.getElementById('app'),
  model: {
    version: 'v7',
    path: '_/puppet.mjs'
  },
  derived: {
    result() {
      return `https://cdn.jsdelivr.net/gh/anatolipr/statics@${this.getValue('version')}/${this.getValue('path')}`
    }
  }
});
