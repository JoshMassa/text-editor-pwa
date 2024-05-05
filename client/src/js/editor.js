// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, addNewEntry } from './database';
import { header } from './header';

export default class {
  constructor() {
    this.isDirty = false;

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // Load and display all entries from IndexedDB
    getDb().then((data) => {
      if (data && data.length > 0) {
        const combinedContent = data.map(entry => entry.content).join('\n\n---\n\n');
        this.editor.setValue(combinedContent);
      } else {
        // Fallback to localStorage or header
        const localData = localStorage.getItem('content');
        if (localData) {
          this.editor.setValue(localData);
        } else {
          this.editor.setValue(header);
        }
      }
      this.isDirty = false;
    }).catch(error => {
      console.error('Error loading data: ', error);
      this.editor.setValue(header);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
      this.isDirty = true; // Mark as dirty whenever content is changed
    });

    // Save the content of the editor when the editor itself loses focus
    this.editor.on('blur', () => {
      if (this.isDirty) {
        console.log('The editor has lost focus');
        addNewEntry(this.editor.getValue()).then(id => {
          console.log('New entry saved with ID:', id);
          this.isDirty = false; // Reset the dirty flag after saving
        }).catch(error => {
          console.error('Failed to save the new entry: ', error);
        });
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.isDirty) {
        localStorage.setItem('content', this.editor.getValue());
      }
    });
  }
}