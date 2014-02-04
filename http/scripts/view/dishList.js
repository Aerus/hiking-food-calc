/**
 * Created by Serhii_Kotyk on 1/3/14.
 */
var DishList = {
    getDishListDomElement: function(){
        var element = document.getElementById('dishSelector');
        this.getDishListDomElement = function(){
            return element;
        }
        return this.getDishListDomElement();
    },
    refill : function(){
        var dishes = Router.getDishNames();
        for(var i = 0; i < dishes.length; i++){
            this.add(dishes[i]);
        }
    },
    clear : function(){
        this.getDishListDomElement().innerHTML = "";
    },
    add : function(name){
        this.getDishListDomElement().appendChild(
            buildElement(
                'div',
                {
                    checkbox: {
                        _tag: 'input',
                        type: 'checkbox'
                    },
                    label: {
                        _tag: 'label',
                        innerText: name
                    }
                }
            )
        );
    },

    /**
     * Gets names of ticked dishes
     *
     * @returns {Array} String[] dish names
     */
    getSelected: function(){
        var labels = this.getDishListDomElement().querySelectorAll('input[type=checkbox]:checked + label');
        var results = [];

        if (labels instanceof NodeList
            && labels.length > 0){
            for (var i = 0; i < labels.length; i++){
                results.push(labels[i].innerText);
            }
        }

        return results;
    }
};