/**
 * Created by Serhii_Kotyk on 1/3/14.
 */
var DishList = {
    selectedCheckboxQuery: 'input[type=checkbox]:checked',
    selectedDishQuery: 'input[type=checkbox]:checked + label',

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
        var labels = this.getDishListDomElement().querySelectorAll(this.selectedDishQuery);
        var results = [];

        if (labels instanceof NodeList
            && labels.length > 0){
            for (var i = 0; i < labels.length; i++){
                results.push(labels[i].innerText);
            }
        }

        return results;
    },

    /**
     * counts selected dishes
     * @returns {number}
     */
    getSelectedCount: function(){
        var labels = this.getDishListDomElement().querySelectorAll(this.selectedDishQuery);

        return labels.length || 0;
    },

    /**
     * gets refferences of checked checkboxes
     */
    getCheckedCheckboxed: function(){
        return this.getDishListDomElement().querySelectorAll(this.selectedCheckboxQuery);
    },

    /**
     * unselects selected dishes
     */
    clearSelection: function(){
        var selected = this.getCheckedCheckboxed();

        for(var i = 0; i < selected.length; i++){
            selected[i].checked = false;
            GlobalObserver.publish(Event.DISH_LIST_CHECKED_STATE_CHANGE, {sender: selected[i]});
        }
    },

    onload: function(){
        this.refill();

        this.getDishListDomElement().onchange = function(event){
            GlobalObserver.publish(Event.DISH_LIST_CHANGED, {
                event: event
            });
        };
    }
};

GlobalObserver.subscribe(Event.DISH_LIST_CHANGED, function(data){
    var event = data.event;
    if (event.srcElement){
        var el = event.srcElement;
        if (el.tagName === 'INPUT' && el.type === 'checkbox'){
            GlobalObserver.publish(Event.DISH_LIST_CHECKED_STATE_CHANGE, {
                event: event,
                sender: el
            });
        }
    }
});

GlobalObserver.subscribe(Event.DISH_LIST_CHECKED_STATE_CHANGE, function(data){
    var element = data.sender;
    if (element){
        if (element.checked){
            GlobalObserver.publish(Event.DISH_CHECKED, data);
        }else{
            GlobalObserver.publish(Event.DISH_UNCHECKED, data);
        }
    }
});

GlobalObserver.subscribe(Event.DISH_LIST_CHECKED_STATE_CHANGE, function(data){
    if (DishList.getSelectedCount() > 0){
        GlobalObserver.publish(Request.UPDATE_ADD_DISH_BUTTON_VISIBLE, {
            visibleByDishList: true
        });
    }else{
        GlobalObserver.publish(Request.UPDATE_ADD_DISH_BUTTON_VISIBLE, {
            visibleByDishList: false
        });
    }
});

GlobalObserver.subscribe(Event.DISHES_ADDED, function(){
    DishList.clearSelection();
});