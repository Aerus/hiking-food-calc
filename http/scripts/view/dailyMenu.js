/**
 * Created by Serhii_Kotyk on 1/16/14.
 */
var DailyMenu = {
    init: function(daysCount){
        if (typeof daysCount !== 'number'
            || daysCount < 1){
            return;
        }
        this.clear();
        for(var i = 0; i < daysCount; i++){
            this.getMenuDomContainer().appendChild(this.compileSingleDayMenu(i + 1));
        }
    },

    clear: function(){
        this.getMenuDomContainer().innerHTML = "";
    },

    getMenuDomContainer: function(){
        if (!this._domContainer){
            this._domContainer = document.getElementById('selectionDestination');
        }
        return this._domContainer;
    },

    compileSingleDayMenu: function(label){
        var div = buildElement(
            {
                _tag: 'div',
                class: CSSClass.SINGLE_DAY_MENU,
                label: {
                    _tag: 'div',
                    innerText: label,
                    class: CSSClass.SINGLE_DAY_LABEL
                },
                breakfest: this.compileSingleTimeMenu(Localization.BREAKFAST_LABEL),
                lunch: this.compileSingleTimeMenu(Localization.LUNCH_LABEL),
                supper: this.compileSingleTimeMenu(Localization.SUPPER_LABEL)
            }
        );

        return div;
    },

    compileSingleTimeMenu: function(label){
        return buildElement('div', {
            label: {
                _tag: 'span',
                innerText: label
            },
            value: {
                _tag: 'span'
            },
            class: CSSClass.SINGLE_TIME_MENU
        });
    }
};

GlobalObserver.subscribe(Event.APPLY_BUTTON_CLICKED, function(){
    DailyMenu.init(GroupSettings.getDaysCount());
});