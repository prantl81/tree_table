(function() {
    window.globVar_UI5_Table = "test";
    let _shadowRoot;
    let _id;
    let _password;

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Number of Rows</legend>
          <table>
            <tr>
              <td>Color</td>
              <td><input id="rowsVisble" type="integer" size="10" maxlength="2"></td>
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
    							rowsVisble: this.rowsVisble
    						}
    					}
    			}));
    		}

    		set color(newNumberRowsVisble) {
    			this._shadowRoot.getElementById("rowsVisble").value = newNumberRowsVisble;
    		}

    		get color() {
    			return this._shadowRoot.getElementById("rowsVisble").value;
    		}
    	}

    	customElements.define("tp-sac-tree-table-ui5-builder", ui5TreeTableBuilder);
    })();
