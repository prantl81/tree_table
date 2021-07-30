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
                   <TreeTable id="TreeTable" rows="{/spl}" selectionMode="None" visibleRowCount="25" enableSelectAll="false" ariaLabelledBy="title">
                       <extension>
                          <m:OverflowToolbar style="Clear">
                             <m:SearchField id="searchField" width="30%" placeholder="Search for Customer" search=".onSearch" suggest=".onSuggest" suggestionItems="{path: '/spl'}">
                                <m:SuggestionItem text="{name}" description="{name}" key="{name}" />
                             </m:SearchField>
                             <m:ToolbarSpacer />
                             <m:Button text="Collapse all" press="onCollapseAll" />
                             <m:Button text="Expand first level" press="onExpandFirstLevel" />
                          </m:OverflowToolbar>
                       </extension>
                       <columns>
                          <Column width="25rem" sortProperty="name" filterProperty="name">
                             <m:Label text="Customer" />
                             <template>
                                <m:Text text="{name}" wrapping="false" />
                             </template>
                          </Column>
                          <Column  hAlign="Center">
                              <m:Label text="Flag" />
                              <template>
                                  <m:CheckBox selected="{spl_flag}" enabled="true"/>
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

              if ("rowsVisble" in changedProperties) {
                this.$rowsVisble = changedProperties["rowsVisble"];
              }

              debugger;
			        this.render(this.$rowsVisble);
              let TreeTabel = document.getElementById('TreeTable').innerHTML;
              TreeTable.visibleRowCount=11;

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

        render(numberVisibleRows) {
            let  TreeTable = window.globVar_UI5_Table;
        }


        addRow(NewRow){
          debugger;

          //here we get the new fields from SAC -> all fields are filled
          var channelNewRow = NewRow.l1;   //-> Top Node, Channel
          var lh4NewRow = NewRow.l2;   //-> Second Level, LH4
          var mplNewRow = NewRow.l3;   //-> MPL, details
          var splFlagNewRow = NewRow.flag;   //-> SPL flag (X = true/ "" = false)

          //Map SPL Flag X to true or empty to false
          var splFlagBoolean = true;
          if ( splFlagNewRow === "X" ) {
             splFlagBoolean = true;
          } else {
             splFlagBoolean = false;
          }

          var TreeTable = window.globVar_UI5_Table;
          var oModel = TreeTable.getModel();
          var oData = oModel.getData();
          var tableData = oData.spl;

          //First check highest level -> channel_index
          var channel_index = tableData.findIndex(function (line) {
            return line.name === channelNewRow;
          });

          if ( channel_index !== -1) {
            //channel already exists
              var channel_array = tableData[channel_index].spl;
              var lh4_index = channel_array.findIndex(function (line) {
                return line.name === lh4NewRow;
              });

              if ( lh4_index !== -1) {
                var lh4_array = tableData[channel_index].spl[lh4_index].spl;
                var mpl_index = lh4_array.findIndex(function (line) {
                  return line.name === mplNewRow;
                });
                if ( mpl_index !== -1) {
                  //existing MPL -> only update flag
                  var mpl_array = lh4_array.spl[mpl_index].spl_flag = splFlagBoolean;
                } else {
                  //new MPL push into existing LH4
                  let mpl = {"name": mplNewRow, "spl_flag": splFlagBoolean };
                  tableData[channel_index].spl[lh4_index].spl.push(mpl);
                }

              } else {
                // new LH4 node added to existing channel
                let mpl = [{"name": mplNewRow, "spl_flag": splFlagBoolean }];
                let lh4 = {"name": lh4NewRow, "spl": mpl};
                tableData[channel_index].spl.push(lh4);
              }
          } else {
            // new top node -> create all three levels
            let mpl = [{"name": mplNewRow, "spl_flag": splFlagBoolean }];
            let lh4 = [{"name": lh4NewRow, "spl": mpl}];
            let channel = {"name": channelNewRow, "spl": lh4};
            tableData.push(channel);
          }
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
            sap.ui.require([
                "sap/base/Log",
                "sap/ui/core/mvc/Controller",   //define as we can't require the MVC controller
                "sap/ui/model/Sorter",
                "sap/ui/model/json/JSONModel",
                "sap/m/MessageToast",
                "sap/ui/core/format/DateFormat",
                "sap/m/ToolbarSpacer",
                "sap/ui/table/library",
                "sap/ui/thirdparty/jquery",
                "sap/ui/model/Filter",
	              "sap/ui/model/FilterOperator",
                "sap/ui/model/FilterType"
             ], function(Log, Controller, Sorter, JSONModel, MessageToast, DateFormat, ToolbarSpacer, library, jQuery, Filter, FilterOperator, FilterType) {
                "use strict";

                //Define and instantiate controller
                var controller = Controller.extend("myView.Template", {
                                   onInit: function() {

                                     if (that._firstConnection === 0) {
                                         that._firstConnection = 1;
                                     } else {

                                       if (that_._designMode) {
                                           var oData =
                                             { "spl": [
                                                     {"name":"Level One - 1", "spl": [
                                                         {"name": "Level Two - 1", "spl": [
                                                           {"name": "Level Three - 1", "spl_flag": "X "},
                                                           {"name": "Level Three - 2", "spl_flag": ""  },
                                                           {"name": "Level Three - 3", "spl_flag": "X" }
                                                         ]},
                                                         {"name": "Level Two - 2", "spl": [
                                                           {"name": "Level Three - 4", "spl_flag": ""  },
                                                           {"name": "Level Three - 5", "spl_flag": "X" }
                                                         ]},
                                                         {"name": "Level Two - 3", "spl": [
                                                           {"name": "Level Three - 6", "spl_flag": "X" },
                                                           {"name": "Level Three - 7", "spl_flag": "X" },
                                                           {"name": "Level Three - 8", "spl_flag": "" },
                                                           {"name": "Level Three - 9", "spl_flag": "" }
                                                         ]},
                                                         {"name": "Level Two - 4", "spl": [
                                                           {"name": "Level Three - 10", "spl_flag": "" },
                                                           {"name": "Level Three - 11", "spl_flag": "" }
                                                         ]}
                                                     ]},
                                                     {"name":"Level One - 2", "spl": [
                                                       {"name": "Level Two - 5", "spl": [
                                                            {"name": "Level Three - 12", "spl_flag": "X" },
                                                            {"name": "Level Three - 13", "spl_flag": "X" }
                                                         ]},
                                                         {"name": "Level Two - 6", "spl": [
                                                           {"name": "Level Three - 14", "spl_flag": "X" },
                                                           {"name": "Level Three - 15", "spl_flag": "X" }
                                                         ]}
                                                     ]}
                                           ]};
                                        } else {
                                        // not design mode -> we do not pass example data
                                       var oData = {
                                          "spl": []};
                                        }


                                           var oModel = new JSONModel(oData);
                                           this.getView().setModel(oModel);

                                      }

                                   },

                                   onBeforeRendering: function() {
                                         window.globVar_UI5_Table = this.byId('TreeTable');
                                   },

                                   onSearch : function () {
			                                  var oView = this.getView(),
				                                sValue = oView.byId("searchField").getValue(),
				                                oFilter = new Filter("name", FilterOperator.Contains, sValue);
			                                  oView.byId("TreeTable").getBinding("rows").filter(oFilter, FilterType.Application);
                                        oView.byId("TreeTable").getBinding("rows").expandToLevel(3);
		                                    },
                                   onSuggest: function(event) {

                                          var sValue = event.getParameter("suggestValue"),
      		                                  aFilters = [];
                                            if (sValue) {
      	                                       aFilters.push(new Filter({
      	                                          filters: [
      		                                            new Filter("rows", FilterOperator.Contains, sValue.toUpperCase()),
      		                                                 ],
      		                                              and: false
      		                                    }));
      		                                 }
      		                                   var oSource = event.getSource();
      		                                   var oBinding = oSource.getBinding('suggestionItems');
      		                                   oBinding.filter(aFilters);
      		                                   oBinding.attachEventOnce('dataReceived', function() {
      		                                   oSource.suggest();
      		                                   });

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


               //Instantiate and place the view
               //### THE APP: place the XMLView somewhere into DOM ###
               var oView  = sap.ui.xmlview({
                   viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
               });
               oView.placeAt(content);



            });




            if (that_._designMode) {
                //oView.byId("passwordInput").setEnabled(false);
            }
        });
    }

    // ---------------- UTILS END -----------------------------------------------

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === true ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



})();
