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
        var singelTime = buildElement('div', {
            label: {
                _tag: 'span',
                innerText: label
            },
            value: {
                _tag: 'span'
            },
            class: CSSClass.SINGLE_TIME_MENU
        });

        singelTime.onclick = function(event){
            GlobalObserver.publish(Event.SINGLE_TIME_MENU_CLICKED, {
                event: event,
                sender: singelTime
            });
        };

        return singelTime;
    },

    selected: {
        singleTime: null,
        singleDay: null
    }
};

GlobalObserver.subscribe(Event.APPLY_BUTTON_CLICKED, function(){
    DailyMenu.init(GroupSettings.getDaysCount());
});

GlobalObserver.subscribe(Event.SINGLE_TIME_MENU_CLICKED, function(data){
    if (DailyMenu.selected.singleTime){
        DailyMenu.selected.singleTime.removeClass(CSSClass.SELECTED);
    }
    if (DailyMenu.selected.singleDay){
        DailyMenu.selected.singleDay.removeClass(CSSClass.SELECTED);
    }

    data.sender.toggleClass(CSSClass.SELECTED);
    data.sender.parentNode.addClass(CSSClass.SELECTED);

    DailyMenu.selected.singleTime = data.sender;
    DailyMenu.selected.singleDay = data.sender.parentNode;
});