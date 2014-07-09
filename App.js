Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    componentCls: 'app',
    scopeType: 'iteration',
    comboboxConfig: {
        fieldLabel: 'Select an Iteration:',
        labelWidth: 100,
        width: 300
    },
    
    onScopeChange: function() {
        this._getIteration();
    },
    
    
    _getIteration: function() {
            this._iteration = this.getContext().getTimeboxScope().record.get('_ref');
            console.log('iteration',this._iteration);
            
            if (!this.down('#b2')) {
                 var that = this;
                 var cb = Ext.create('Ext.Container', {
            
                items: [
                    {
                        xtype  : 'rallybutton',
                        text      : 'create',
                        id: 'b2',
                        handler: function() {
                            that._getModel(); 
                        }
                    }
                        
                    ]
                });
            this.add(cb);
            }
        },
    _getModel: function(){
            var that = this;
            Rally.data.ModelFactory.getModel({
                type: 'TestSet',
                success: function(model) { 
                    that._model = model;
                    var ts = Ext.create(model, {
                        Name: 'SomeTestSet',
                        Iteration: that._iteration
                    });
                    ts.save({
                        callback: function(result, operation) {
                            if(operation.wasSuccessful()) {
                                console.log(result.get('Name'), ' ', result.get('Iteration')._refObjectName);
                                that._readRecord(result);
                            }
                            else{
                                console.log("?");
                            }
                        }
                    });
                }
            });
        },
    
     _readRecord: function(result) {
        var id = result.get('ObjectID');
        this._model.load(id, {
            fetch: ['Name','TestCases'],
            callback: this._onRecordRead(result),
            scope: this
        });
    },

    _onRecordRead: function(record, operation) {
        console.log('There are ', record.get('TestCases').Count, ' in ', record.get('Name') );
    
        var testcaseStore = record.getCollection('TestCases');
        testcaseStore.load({
            callback: function() {
                testcaseStore.add('/testcase/19881914946','/testcase/19882096605');
                testcaseStore.sync({
                    callback: function() {
                        console.log('success');
                    }
                });
            }
        });
    }
    
});
