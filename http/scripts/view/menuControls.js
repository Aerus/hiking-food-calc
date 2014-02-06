/**
 * Created by Serhii_Kotyk on 2/5/14.
 */
var MenuControls = {
    getAddDishButton: function(){
        var button = document.body.querySelector('#addDishButton');
        this.getAddDishButton = function(){
            return button;
        }
        return button;
    },

    getRemoveDishButton: function(){
        var button = document.body.querySelector('#removeDishButton');
        this.getRemoveDishButton = function(){
            return button;
        }
        return button;
    },

    getClearButton: function(){
        var button = document.body.querySelector('#clearButton');
        this.getClearButton = function(){
            return button;
        }
        return button;
    },

    hideAddDishButton: function(){
        this.getAddDishButton().addClass(CSSClass.HIDDEN);
    },

    hideRemoveDishButton: function(){
        this.getRemoveDishButton().addClass(CSSClass.HIDDEN);
    },

    hideClearDishButton: function(){
        this.getClearButton().addClass(CSSClass.HIDDEN);
    },

    showAddDishButton: function(){
        this.getAddDishButton().removeClass(CSSClass.HIDDEN);
    },

    showRemoveDishButton: function(){
        this.getRemoveDishButton().removeClass(CSSClass.HIDDEN);
    },

    showClearDishButton: function(){
        this.getClearButton().removeClass(CSSClass.HIDDEN);
    },

    addButtonVisibleState: {
        visibleByDishList: false,
        visibleByDailyMenu: false
    }
};

GlobalObserver.subscribe(Request.UPDATE_ADD_DISH_BUTTON_VISIBLE, function(data){
    var changed = false;
    if ('boolean' === typeof data.visibleByDishList) {
        MenuControls.addButtonVisibleState.visibleByDishList = data.visibleByDishList;
        changed = true;
    }
    if ('boolean' === typeof data.visibleByDailyMenu) {
        MenuControls.addButtonVisibleState.visibleByDailyMenu = data.visibleByDailyMenu;
        changed = true;
    }

    if (changed){
        GlobalObserver.publish(Event.ADD_DISH_BUTTON_VISIBLE_STATE_CHANGED, MenuControls.addButtonVisibleState);
    }
});

GlobalObserver.subscribe(Event.ADD_DISH_BUTTON_VISIBLE_STATE_CHANGED, function(data){
    if (data
        && data.visibleByDailyMenu
        && data.visibleByDishList){
        MenuControls.showAddDishButton();
    }else{
        MenuControls.hideAddDishButton();
    }
});