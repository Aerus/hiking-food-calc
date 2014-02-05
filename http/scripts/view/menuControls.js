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
    }
};