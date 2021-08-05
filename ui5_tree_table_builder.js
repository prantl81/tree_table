(function() {
    let template = document.createElement("template");
    template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Table Settings</legend>
          <table>
            <tr>
              <td>Number of Rows</td>
              <td><input id="builder_rowsVisible" type="number" min="1" max="50" size="2" maxlength="2"></td>
            </tr>
          </table>
            <input type="submit" style="display:none;">
      </fieldset>
    </form>
    <style>
     :host {
         display: block;
         padding: 1em 1em 1em 1em;
     }
    </style>
    `;

    class ui5TreeTableBuilder extends HTMLElement {
    		constructor() {
    			super();
    			this._shadowRoot = this.attachShadow({mode: "open"});
    			this._shadowRoot.appendChild(template.content.cloneNode(true));
    			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
    		}

    		_submit(e) {
    			e.preventDefault();
    			this.dispatchEvent(new CustomEvent("propertiesChanged", {
    					detail: {
    						properties: {
    							rowsVisible: this.rowsVisible
    						}
    					}
    			}));
    		}

    		set rowsVisible(newNumberRowsVisble) {
    			this._shadowRoot.getElementById("builder_rowsVisible").value = newNumberRowsVisible;
    		}

    		get rowsVisible() {
    			return this._shadowRoot.getElementById("builder_rowsVisible").value;
    		}
    	}

    	customElements.define("rb-sac-tree-table-ui5-builder", ui5TreeTableBuilder);
    })();
