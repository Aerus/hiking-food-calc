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
    }
};