(function() {
    let _shadowRoot;
    let _id;
    window.globVar_UI5_Table = "";

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
        <style>
        </style>
        <div id="ui5_content" name="ui5_content">
         <slot name="content"></slot>
        </div>
        <?xml version="1.0" encoding="UTF-8"?>
        <script id="oView" name="oView" type="sapui5/xmlview">
           <mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.ui.table" xmlns:core="sap.ui.core" xmlns:dnd="sap.ui.core.dnd" xmlns:m="sap.m" xmlns:u="sap.ui.unified" controllerName="com.evosight.sacwidgets.redbull.RBUI5TreeTable" height="100%">
              <m:Page showHeader="false" enableScrolling="false">
                 <m:content>
                   <TreeTable id="TreeTable" rows="{/spl}" selectionMode="None" visibleRowCount="25" enableSelectAll="false" ariaLabelledBy="title" filter="onfilter">
                       <extension>
                          <m:OverflowToolbar style="Clear">
                             <m:SearchField id="searchField" width="30%" placeholder="Search" search="onSearch" suggest="onSuggest" suggestionItems="{path: '/spl'}">
                                <m:SuggestionItem text="{name}" description="{name}" key="{name}" />
                             </m:SearchField>
                             <m:ToolbarSpacer />
                             <m:Label text="Expand To Level" />
                             <m:SegmentedButton selectedKey="2" id="SB1" selectionChange="onCollapseLevelChange">
					                        <m:items>
						                            <m:SegmentedButtonItem text="1"  />
						                            <m:SegmentedButtonItem text="2" key="2"/>
						                            <m:SegmentedButtonItem text="3" />
					                        </m:items>
				                     </m:SegmentedButton>
                          </m:OverflowToolbar>
                       </extension>
                       <columns>
                          <Column width="25rem" filterProperty="name">
                             <m:Label text="Account Name" />
                             <template>
                                <m:Text text="{name}" wrapping="false" />
                             </template>
                          </Column>
                          <Column width="25rem" filterProperty="id">
                             <m:Label text="Account ID" />
                             <template>
                                <m:Text text="{id}" wrapping="false" />
                             </template>
                          </Column>
                          <Column  hAlign="Center">
                              <m:Label text="SPL A" />
                              <template>
                                  <m:CheckBox selected="{spl_flag}" enabled="{flagEnabled}" select="onCheckBoxSelect"/>
                              </template>
                          </Column>
                          <Column  hAlign="Center">
                              <m:Label text="SPL B" />
                              <template>
                                  <m:CheckBox selected="{spl_flag}" enabled="{flagEnabled}" select="onCheckBoxSelect"/>
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


            //-- Custom Widget - Events

            this.addEventListener("onCheckBoxChange_UI5_event", event => {
                let detail = event.detail.checkBoxContext;
                let returnValue = "";

                //Fill dummy property to read it via method getCheckBoxRow
                this._props.checkBoxChanged = detail;

            //inform the widget that the version button was pressed, in SAC we can then read the property rowDetails
            this.dispatchEvent(new Event("onCheckBoxChange", { }));

           });


           this.addEventListener("click", event => {
                 console.log('click');
                 let  TreeTable = window.globVar_UI5_Table
                 let oSelectionIndex =  TreeTable.getSelectedIndex();
                 if ( oSelectionIndex > -1 ){
             					let context = TreeTable.getContextByIndex(oSelectionIndex);
             					let value = context.getProperty("ProductId");

                      //Fill dummy property to read it via method ...
                      this._props.rowDetails = value;

                     //inform the widget that another row was selected, in SAC we can then read the property rowDetails
                     this.dispatchEvent(new Event("onSelectionChange", { }));
                 }
             });

             this.addEventListener("handleVisibleRowChange", event => {

                 //let  TreeTable = this.byId('TreeTable');
                 //TreeTable.setVisibleRowCount(parseInt(this.$rowsVisible));
            });


            //empty properties
            this._props = {};


            //-> add loadthis here
            loadthis(this);

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
              if ("rowsVisible" in changedProperties) {
                this.$rowsVisible = changedProperties["rowsVisible"];
                  //Event to handle
                  this.dispatchEvent(new Event("handleVisibleRowChange", { }));
              }


              //loadthis(this);

			        //this.render(20);

              //window.globVar_UI5_Table.visibleRowCount=11;

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

          //not implemented that way, we use the "propertiesChanged" event to let the Custom Widget SDK framework do the job
          set rowsVisible(newValue) {
              this.$rowsVisible = newValue;
          }


          get rowsVisible() {
              return this.this.$rowsVisible;
          }



          // ---------------   "custom" methods of the widget --------------------------------

        render(numberVisibleRows) {
          var TreeTable = this.byId('TreeTable');
          TreeTable.setVisibleRowCount(19);
        }

        addRow(NewRow){
          //here we get the new fields from SAC -> all fields are filled
          var channelNewRow   = NewRow.l1;   //-> Top Node, Channel
          var channelNewRowID = NewRow.l1Id;

          var lh4NewRow = NewRow.l2;   //-> Second Level, LH4
          var lh4NewRowID = NewRow.l2Id;   //-> Second Level, LH4
          var lh4Flag =  NewRow.l2Flag;

          var mplNewRow = NewRow.l3;   //-> MPL, details
          var mplNewRowID = NewRow.l3Id;   //-> MPL, details
          var splFlagNewRow = NewRow.flag;   //-> SPL flag (X = true/ "" = false)

          var lh4FlagBoolean = true;
          if ( lh4Flag === "X" ) {
             lh4FlagBoolean = true;
          } else {
             lh4FlagBoolean = false;
          }


          //Map SPL Flag X to true or empty to false
          var splFlagBoolean = true;
          if ( splFlagNewRow === "X" ) {
             splFlagBoolean = true;
          } else {
             splFlagBoolean = false;
          }

          var oTreeTable = window.globVar_UI5_Table;
          var oModel = oTreeTable.getModel();
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
                  tableData[channel_index].spl[lh4_index].spl[mpl_index].spl_flag = splFlagBoolean;
                } else {
                  //new MPL push into existing LH4
                  let mpl = {"name": mplNewRow, "id": mplNewRowID, "flagEnabled": true, "spl_flag": splFlagBoolean };
                  tableData[channel_index].spl[lh4_index].spl.push(mpl);
                }

              } else {
                // new LH4 node added to existing channel
                let mpl = [{"name": mplNewRow, "id": mplNewRowID, "flagEnabled": true, "spl_flag": splFlagBoolean }];
                let lh4 = {"name": lh4NewRow, "id": lh4NewRowID,  "flagEnabled": true, "spl_flag": lh4FlagBoolean, "spl": mpl};
                tableData[channel_index].spl.push(lh4);
              }
          } else {
            // new top node -> create all three levels
            let mpl = [{"name": mplNewRow, "id": mplNewRowID, "flagEnabled": true, "spl_flag": splFlagBoolean }];
            let lh4 = [{"name": lh4NewRow, "id": lh4NewRowID, "flagEnabled": true, "spl_flag": lh4FlagBoolean, "spl": mpl}];
            let channel = {"name": channelNewRow, "id": channelNewRowID, "flagEnabled": false, "spl": lh4};
            tableData.push(channel);
          }

          oModel.refresh();
        }

        removeAllRows(){

          var TreeTable = window.globVar_UI5_Table;
          var oModel = TreeTable.getModel();
          oModel.oData = {spl: []};
          oModel.refresh();

          return "all rows are deleted.";

       }

      getCheckBoxRow(){
        let checkBoxChangedObject = this._props.checkBoxChanged;
        return checkBoxChangedObject ;
      }


      // ---------------   other methods of the widget --------------------------------



    }

    // ----------------END class Ui5CustTable extends HTMLElement----------------

    customElements.define("rb-sac-tree-table-ui5", Ui5TreeTable);

    // ---------------- UTILS -------------------------------------------------
    function loadthis(that) {
        var that_ = that;

        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function() {
            "use strict";

            sap.ui.loader.config( {
                paths { 'com/evosight/sacwidgets': 'https://prantl81.github.io/ui5_tree_table/' }
            } );
            alert(sap.ui.require.toUrl("com/evosight/sacwidgets"));

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
                "sap/ui/model/FilterType",
                "sap/ui/core/Element"
             ], function(Log, Controller, Sorter, JSONModel, MessageToast, DateFormat, ToolbarSpacer, library, jQuery, Filter, FilterOperator, FilterType, Element) {
                "use strict";

                //Define and instantiate controller


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
