(function() {
    window.globVar_UI5_Table = "test";
    let _shadowRoot;
    let _id;
    let _password;

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
        <style>
        </style>
        <div id="ui5_content" name="ui5_content">
         <slot name="content"></slot>
        </div>
        <?xml version="1.0" encoding="UTF-8"?>
        <script id="oView" name="oView" type="sapui5/xmlview">
           <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.table" xmlns:core="sap.ui.core" xmlns:dnd="sap.ui.core.dnd" xmlns:m="sap.m" xmlns:u="sap.ui.unified" controllerName="myView.Template" height="100%">
              <m:Page showHeader="false" enableScrolling="false">
                 <m:content>
                    <TreeTable id="TreeTable" rows="{categories}" selectionMode="MultiToggle" enableSelectAll="false" ariaLabelledBy="title">
                       <extension>
                          <m:OverflowToolbar style="Clear">
                             <m:Title id="title" text="Clothing" />
                             <m:Button id="cut" text="Cut" icon="sap-icon://scissors" press="onCut" />
                             <m:Button id="paste" text="Paste" icon="sap-icon://paste" press="onPaste" enabled="false" />
                             <m:ToolbarSpacer />
                             <m:Button text="Collapse all" press="onCollapseAll" />
                             <m:Button text="Expand first level" press="onExpandFirstLevel" />
                          </m:OverflowToolbar>
                       </extension>
                       <dragDropConfig>
                          <dnd:DragDropInfo sourceAggregation="rows" targetAggregation="rows" dragStart="onDragStart" drop="onDrop" />
                       </dragDropConfig>
                       <columns>
                          <Column width="13rem">
                             <m:Label text="Categories" />
                             <template>
                                <m:Text text="{name}" wrapping="false" />
                             </template>
                          </Column>
                          <Column width="9rem">
                             <m:Label text="Price" />
                             <template>
                                <u:Currency value="{amount}" currency="{currency}" />
                             </template>
                          </Column>
                       </columns>
                    </TreeTable>
                 </m:content>
              </m:Page>
           </mvc:View>
        </script>
    `;



// ------------------------------------------------------------------
    class Ui5TreeTable extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            _shadowRoot.querySelector("#oView").id = _id + "_oView";

            this.addEventListener("click", event => {
                 console.log('click');
                 let  TreeTable = window.globVar_UI5_Table
                 let oSelectionIndex =  TreeTable.getSelectedIndex();
                 if ( oSelectionIndex > -1 ){
             					let context = TreeTable.getContextByIndex(oSelectionIndex);
             					let value = context.getProperty("ProductId");

             					this.dispatchEvent(new Event("onSelectionChange", {
             						  detail: {
             								properties: {
             								  rowDetails: value
             								}
             						  }
             					}));
                 }
             });


             this.addEventListener("VersionOpenPressed", event => {
                 let detail = event.detail.buttonContext;
                 let returnValue = "";

                 //Loop Over Object to get only values into
                 let index = 0;
                 for (const [key, value] of Object.entries(detail)) {
                   //we start not with a | , format: <field1>|<field2>|<field3>
                       if ( index === 0 ){
                           returnValue = value;
                       } else {
                           returnValue = returnValue + "|" + value;
                       }
                       index = index + 1;
                 }

             //change property rowDetails
             this.dispatchEvent(new CustomEvent("propertiesChanged", {
                   detail: {
                     properties: {
                       rowDetails: returnValue
                     }
                   }
               }
             ));

             //inform the widget that the version button was pressed, in SAC we can then read the property rowDetails
             this.dispatchEvent(new Event("OpenVersionPress", { }));


         });

        this.addEventListener("VersionDeletePressed", event => {
                    let detail = event.detail.buttonContext;
                    let returnValue = "";

                    //Loop Over Object to get only values into
                    let index = 0;
                    for (const [key, value] of Object.entries(detail)) {
                      //we start not with a | , format: <field1>|<field2>|<field3>
                          if ( index === 0 ){
                              returnValue = value;
                          } else {
                              returnValue = returnValue + "|" + value;
                          }
                          index = index + 1;
                    }

                //change property rowDetails
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                      detail: {
                        properties: {
                          rowDetails: returnValue
                        }
                      }
                  }
                ));

                //inform the widget that the version button was pressed, in SAC we can then read the property rowDetails
                this.dispatchEvent(new Event("DeleteVersionPress", { }));

          });

            //empty properties
            this._props = {};

          } //constructor




          // ---------------   Standard Methods --------------------------------

          // executed Jbefore the properties of the custom widget are updated.
          onCustomWidgetBeforeUpdate(changedProperties) {
              if ("designMode" in changedProperties) {
                  this._designMode = changedProperties["designMode"];
              }
              //merged with the properties of the _props object. Thus, _props contains the state of all properties before the update
              this._props = { ...this._props, ...changedProperties };
          }



          // executed after the properties of the custom widget have been updated.
          onCustomWidgetAfterUpdate(changedProperties) {

              loadthis(this);

              if ("rowDetails" in changedProperties) {
                this.rowDetails = changedProperties["rowDetails"];
              }
          }



          // executed when this Web Component of the custom widget is connected to the HTML DOM of the web page.
          connectedCallback() {
              try {
                  if (window.commonApp) {
                      let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                      if (outlineContainer && outlineContainer.getReactProps) {
                          let parseReactState = state => {
                              let components = {};

                              let globalState = state.globalState;
                              let instances = globalState.instances;
                              let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                              let names = app.names;

                              for (let key in names) {
                                  let name = names[key];

                                  let obj = JSON.parse(key).pop();
                                  let type = Object.keys(obj)[0];
                                  let id = obj[type];

                                  components[id] = {
                                      type: type,
                                      name: name
                                  };
                              }

                              for (let componentId in components) {
                                  let component = components[componentId];
                              }

                              let metadata = JSON.stringify({
                                  components: components,
                                  vars: app.globalVars
                              });

                              if (metadata != this.metadata) {
                                  this.metadata = metadata;

                                  this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                      detail: {
                                          properties: {
                                              metadata: metadata
                                          }
                                      }
                                  }));
                              }
                          };

                          let subscribeReactStore = store => {
                              this._subscription = store.subscribe({
                                  effect: state => {
                                      parseReactState(state);
                                      return {
                                          result: 1
                                      };
                                  }
                              });
                          };

                          let props = outlineContainer.getReactProps();
                          if (props) {
                              subscribeReactStore(props.store);
                          } else {
                              let oldRenderReactComponent = outlineContainer.renderReactComponent;
                              outlineContainer.renderReactComponent = e => {
                                  let props = outlineContainer.getReactProps();
                                  subscribeReactStore(props.store);

                                  oldRenderReactComponent.call(outlineContainer, e);
                              }
                          }
                      }
                  }
              } catch (e) {}
          }



          // executed when this Web Component of the custom widget is disconnected from the HTML DOM of the web page.
          disconnectedCallback() {
              if (this._subscription) {
                  this._subscription();
                  this._subscription = null;
              }
          }



          // execute JavaScript code when the custom widget is resized
          onCustomWidgetResize(width, height) {
          }



          // ---------------   Property Setter/Getter Functions

          /* not implemented that way, we use the "propertiesChanged" event to let the Custom Widget SDK framework do the job
          set rowDetails(newValue) {
              this.rowDetails = newValue;
          }


          get rowDetails() {
              return this.this.rowDetails;
          }
          */


          // ---------------   "custom" methods of the widget --------------------------------

        addRow(NewRow){
          let arrayMembers = NewRow.split('|');

          let assosciated_array = {
            Name : arrayMembers[0],
            ProductId : arrayMembers[1],
            Quantity  : arrayMembers[2],
            DeliveryDate : arrayMembers[3]
          }

          let  TreeTable = window.globVar_UI5_Table;
          let oModel = TreeTable.getModel();
          let oData = oModel.getData();
          oData.TableData.push(assosciated_array);
          oModel.refresh();
        }


        deleteRow(RowToDelete){

          //alternativly -> get selected row
          let  TreeTable = window.globVar_UI5_Table

          //check if a row is selected
          let oSelectionIndex =  TreeTable.getSelectedIndex();
          if ( oSelectionIndex > -1 ){
              var oContext = TreeTable.getContextByIndex(TreeTable.getSelectedIndex());
              var sPath = oContext.getPath();
              var oSelRow = oContext.getProperty(sPath);


              let oModel = TreeTable.getModel();
              let oData = oModel.getData();

              //Delete record from table
            	for(var i=0; i<oData.TableData.length; i++){
            			if(oData.TableData[i] == oSelRow ){
            						oData.TableData.splice(i,1); //removing 1 record from i th index.
            						oModel.refresh();
            						break;//quit the loop
            			}
            	}
              return "Line Deleted.";
    	      } else {
              return "NO line selected!";
            }
       }


        getSelectedRow(){
              let returnValue = "";
              let  TreeTable = window.globVar_UI5_Table

              //check if a row is selected
              let oSelectionIndex =  TreeTable.getSelectedIndex();
              if ( oSelectionIndex > -1 ){


                var oContext = TreeTable.getContextByIndex(oSelectionIndex);

                var sPath = oContext.getPath();
                var oSelRow = oContext.getProperty(sPath);


                //Loop Over Object to get only values into
                let index = 0;
                for (const [key, value] of Object.entries(oSelRow)) {
                      //we start not with a | , format: <field1>|<field2>|<field3>
                      if ( index === 0 ){
                        returnValue = value;
                      } else {
                        returnValue = returnValue + "|" + value;
                      }
                      index = index + 1;
                }
                return returnValue;
            } else {
                return "no row selected!"
            }
        }


          // ---------------   other methods of the widget --------------------------------



    }

    // ----------------END class Ui5CustTable extends HTMLElement----------------

    customElements.define("tp-sac-tree-table-ui5", Ui5TreeTable);

    // ---------------- UTILS -------------------------------------------------
    function loadthis(that) {
        var that_ = that;

        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "sap/base/Log",
                "sap/ui/core/mvc/Controller",   //define as we can't require the MVC controller
                "sap/ui/model/Sorter",
                "sap/ui/model/json/JSONModel",
                "sap/m/MessageToast",
                "sap/ui/core/format/DateFormat",
                "sap/m/ToolbarSpacer",
                "sap/ui/table/library",
                "sap/ui/thirdparty/jquery"
             ], function(Log, Controller, Sorter, JSONModel, MessageToast, DateFormat, ToolbarSpacer, library, jQuery) {
                "use strict";

                return Controller.extend("myView.Template", {
                                   onInit: function() {

                                     if (that._firstConnection === 0) {
                                         that._firstConnection = 1;
                                     } else {

                                           var oData =
                                             { "categories": [
                                                   {"name": "Women", "categories": [
                                                     {"name":"Clothing", "categories": [
                                                       {"name": "Dresses", "categories": [
                                                         {"name": "Casual Red Dress", "amount": 16.99, "currency": "EUR", "size": "S"},
                                                         {"name": "Short Black Dress", "amount": 47.99, "currency": "EUR", "size": "M"},
                                                         {"name": "Long Blue Dinner Dress", "amount": 103.99, "currency": "USD", "size": "L"}
                                                       ]},
                                                       {"name": "Tops", "categories": [
                                                         {"name": "Printed Shirt", "amount": 24.99, "currency": "USD", "size": "M"},
                                                         {"name": "Tank Top", "amount": 14.99, "currency": "USD", "size": "S"}
                                                       ]},
                                                       {"name": "Pants", "categories": [
                                                         {"name": "Red Pant", "amount": 32.99, "currency": "USD", "size": "M"},
                                                         {"name": "Skinny Jeans", "amount": 44.99, "currency": "USD", "size": "S"},
                                                         {"name": "Black Jeans", "amount": 99.99, "currency": "USD", "size": "XS"},
                                                         {"name": "Relaxed Fit Jeans", "amount": 56.99, "currency": "USD", "size": "L"}
                                                       ]},
                                                       {"name": "Skirts", "categories": [
                                                         {"name": "Striped Skirt", "amount": 24.99, "currency": "USD", "size": "M"},
                                                         {"name": "Black Skirt", "amount": 44.99, "currency": "USD", "size": "S"}
                                                       ]}
                                                     ]},
                                                     {"name":"Jewelry", "categories": [
                                                         {"name": "Necklace", "amount": 16.99, "currency": "USD"},
                                                         {"name": "Bracelet", "amount": 47.99, "currency": "USD"},
                                                         {"name": "Gold Ring", "amount": 399.99, "currency": "USD"}
                                                       ]},
                                                     {"name":"Handbags", "categories": [
                                                       {"name": "Little Black Bag", "amount": 16.99, "currency": "USD", "size": "S"},
                                                       {"name": "Grey Shopper", "amount": 47.99, "currency": "USD", "size": "M"}
                                                     ]},
                                                     {"name":"Shoes", "categories": [
                                                       {"name": "Pumps", "amount": 89.99, "currency": "USD"},
                                                       {"name": "Sport Shoes", "amount": 47.99, "currency": "USD"},
                                                       {"name": "Boots", "amount": 103.99, "currency": "USD"}
                                                     ]}
                                                   ]},
                                                   {"name": "Men", "categories": [
                                                     {"name":"Clothing", "categories": [
                                                       {"name": "Shirts", "categories": [
                                                         {"name": "Black T-shirt", "amount": 9.99, "currency": "USD", "size": "XL"},
                                                         {"name": "Polo T-shirt", "amount": 47.99, "currency": "USD", "size": "M"},
                                                         {"name": "White Shirt", "amount": 103.99, "currency": "USD", "size": "L"}
                                                       ]},
                                                       {"name": "Pants", "categories": [
                                                         {"name": "Blue Jeans", "amount": 78.99, "currency": "USD", "size": "M"},
                                                         {"name": "Stretch Pant", "amount": 54.99, "currency": "USD", "size": "S"}
                                                       ]},
                                                       {"name": "Shorts", "categories": [
                                                         {"name": "Trouser Short", "amount": 62.99, "currency": "USD", "size": "M"},
                                                         {"name": "Slim Short", "amount": 44.99, "currency": "USD", "size": "S"}
                                                       ]}
                                                     ]},
                                                     {"name":"Accessories", "categories": [
                                                       {"name": "Tie", "amount": 36.99, "currency": "USD"},
                                                       {"name": "Wallet", "amount": 47.99, "currency": "USD"},
                                                       {"name": "Sunglasses", "amount": 199.99, "currency": "USD"}
                                                     ]},
                                                     {"name":"Shoes", "categories": [
                                                       {"name": "Fashion Sneaker", "amount": 89.99, "currency": "USD"},
                                                       {"name": "Sport Shoe", "amount": 47.99, "currency": "USD"},
                                                       {"name": "Boots", "amount": 103.99, "currency": "USD"}
                                                     ]}
                                                   ]},
                                                     {"name": "Girls", "categories": [
                                                       {"name":"Clothing", "categories": [
                                                         {"name": "Shirts", "categories": [
                                                           {"name": "Red T-shirt", "amount": 16.99, "currency": "USD", "size": "S"},
                                                           {"name": "Tunic Top", "amount": 47.99, "currency": "USD", "size": "M"},
                                                           {"name": "Fuzzy Sweater", "amount": 103.99, "currency": "USD", "size": "L"}
                                                         ]},
                                                         {"name": "Pants", "categories": [
                                                           {"name": "Blue Jeans", "amount": 24.99, "currency": "USD", "size": "M"},
                                                           {"name": "Red Pant", "amount": 54.99, "currency": "USD", "size": "S"}
                                                         ]},
                                                         {"name": "Shorts", "categories": [
                                                           {"name": "Jeans Short", "amount": 32.99, "currency": "USD", "size": "M"},
                                                           {"name": "Sport Short", "amount": 14.99, "currency": "USD", "size": "S"}
                                                         ]}
                                                       ]},
                                                       {"name":"Accessories", "categories": [
                                                         {"name": "Necklace", "amount": 26.99, "currency": "USD"},
                                                         {"name": "Gloves", "amount": 7.99, "currency": "USD"},
                                                         {"name": "Beanie", "amount": 12.99, "currency": "USD"}
                                                       ]},
                                                       {"name":"Shoes", "categories": [
                                                         {"name": "Sport Shoes", "amount": 39.99, "currency": "USD"},
                                                         {"name": "Boots", "amount": 87.99, "currency": "USD"},
                                                         {"name": "Sandals", "amount": 63.99, "currency": "USD"}
                                                       ]}
                                                     ]},
                                                       {"name": "Boys", "categories": [
                                                         {"name":"Clothing", "categories": [
                                                           {"name": "Shirts", "categories": [
                                                             {"name": "Black T-shirt with Print", "amount": 16.99, "currency": "USD", "size": "S"},
                                                             {"name": "Blue Shirt", "amount": 47.99, "currency": "USD", "size": "M"},
                                                             {"name": "Yellow Sweater", "amount": 63.99, "currency": "USD", "size": "L"}
                                                           ]},
                                                           {"name": "Pants", "categories": [
                                                             {"name": "Blue Jeans", "amount": 44.99, "currency": "USD", "size": "M"},
                                                             {"name": "Brown Pant", "amount": 89.99, "currency": "USD", "size": "S"}
                                                           ]},
                                                           {"name": "Shorts", "categories": [
                                                             {"name": "Sport Short", "amount": 32.99, "currency": "USD", "size": "M"},
                                                             {"name": "Jeans Short", "amount": 99.99, "currency": "USD", "size": "XS"},
                                                             {"name": "Black Short", "amount": 56.99, "currency": "USD", "size": "L"}
                                                           ]}
                                                         ]}
                                                       ]}
                                           ]};


                                           var oModel = new JSONModel(oData);
                                           this.getView().setModel(oModel);

                                      }

                                   },

                                   onBeforeRendering: function() {
                                         window.globVar_UI5_Table = this.byId('TreeTable');
                                   },


                                   onButtonPress: function(oEvent) {
                                       // _password = oView.byId("passwordInput").getValue();
                                       that._firePropertiesChanged();

                                       this.settings = {};
                                       this.settings.rowDetails = "";

                                       that.dispatchEvent(new CustomEvent("onStart", {
                                           detail: {
                                               settings: this.settings
                                           }
                                       }));
                                   },

                                   handleOpenVersionPress: function(oEvent) {
                                   			//MessageToast.show("Details for product with id");
                                        let buttonContext = oEvent.getSource().getBindingContext().getObject();
                                        that.dispatchEvent(new CustomEvent("VersionOpenPressed", { detail: { buttonContext } } ));
                                   },

                                   handleDeleteVersionPress: function(oEvent) {
                                   			//MessageToast.show("Details for product with id");
                                        let buttonContext = oEvent.getSource().getBindingContext().getObject();
                                        that.dispatchEvent(new CustomEvent("VersionDeletePressed", { detail: { buttonContext } } ));
                                   },
                                   onCollapseAll: function() {
			                                  var oTreeTable = this.byId("TreeTable");
			                                  oTreeTable.collapseAll();
		                               },

		                               onExpandFirstLevel: function() {
			                                  var oTreeTable = this.byId("TreeTable");
			                                  oTreeTable.expandToLevel(1);
		                               }
                               });
                           });


            //### THE APP: place the XMLView somewhere into DOM ###
            var oView  = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
            });
            oView.placeAt(content);


            if (that_._designMode) {
                //oView.byId("passwordInput").setEnabled(false);
            }
        });
    }

    // ---------------- UTILS END -----------------------------------------------

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



})();
