/**
 * Created by Serhii_Kotyk on 4/9/14.
 */
Class('Results', function (){
    var results = [];

    this.tableAttributes = {class: 'results'},

    this.tableHeadAttributes = {
            h1: {
                _tag: 'th',
                innerText: Localization.PRODUCT_LABEL
            },
            h2: {
                _tag: 'th',
                innerText: Localization.PACK_LABEL
            },
            h3: {
                _tag: 'th',
                innerText: Localization.BUY_LABEL
            }
        },

    this.containerSelector = "#results";

    this.getContainer = function(){
        var container = document.querySelector(this.containerSelector);
        this.getContainer = function(){
            return container;
        }
        return this.getContainer();
    };

    /*
     Results.Buy.addResults({name:'blue', pack: 1, buy: 20})
     Results.Buy.render()
     */
    this.addResults = function(obj){
        if (results[obj.name]){
            obj.pack && (results[obj.name]['pack'] += obj.pack);
            obj.buy && (results[obj.name]['buy'] += obj.buy);
        }else{
            results[obj.name] = obj;
        }
    };

    this.clear = function(){
        results = [];
        var container = this.getContainer(),
            children = container.childNodes;
        for(var i = 0; i < children.length; i++){
            container.removeChild(children[i]);
        }
    };

    this.render = function(){
        this.getContainer().appendChild(compileTable.apply(this));

        return this;
    };

    function compileTable(){
        var table = buildElement('table', this.tableAttributes),
            thead = buildElement('thead', this.tableHeadAttributes),
            tbody = buildElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        for(var key in results){
            var val = results[key],
                row = compileRow(val);
            tbody.appendChild(row);
        }

        return table;
    };

    function compileRow(row){
        var tr = buildElement('tr');
        for(var key in {name:0, pack:1, buy:2}){
            var val = row[key];
            tr.appendChild(buildElement('td', {
                innerText: 'number' === typeof(val) ? val.toFixed(1) : val
            }));
        }
        return tr;
    };
});

Class.Singleton('Results.Together', function(){
    this.containerSelector = "#together";
}, Results);

