/**
 * Created by Serhii_Kotyk on 1/16/14.
 */
var DailyMenu = {

    clear: function(){
        this.getMenuDomContainer().innerHTML = "";
    },

    getMenuDomContainer: function(){
        if (!this._domContainer){
            this._domContainer = document.getElementById('selectionDestination');
        }
        return this._domContainer;
    },

    compileMeal: function(meal, label){
        if (meal instanceof Meal){
            var mealContainer = buildElement('div', {
                class: CSSClass.MEAL
            });

            if (label){
                mealContainer.appendChild(
                    buildElement('span', {
                        class: CSSClass.MEAL_LABEL,
                        innerText: label
                    })
                );
            }

            for (var i = 0; i < meal.dishCount(); i++){
                var currentDish = meal.getDish(i),
                    dishElement = buildElement('span', {
                        class: CSSClass.DISH,
                        innerText: currentDish
                    });

                mealContainer.appendChild(dishElement);
            }

            mealContainer.onclick = function(event){
                GlobalObserver.publish(Event.MEAL_CLICKED, {
                    event: event,
                    sender: mealContainer,
                    objSender: meal
                });
            };

            return mealContainer;
        }else{
            throw new Error("wrong type. Can't convert " + typeof(meal) + " to Meal");
        }
    },

    compileMenuDay: function(menuDay, label){
        if (menuDay instanceof MenuDay){
            var menuContainer = buildElement('div', {
                class: CSSClass.MENU_DAY
            });

            if (label){
                menuContainer.appendChild(
                    buildElement('span', {
                        class: CSSClass.MENU_DAY_LABEL,
                        innerText: label
                    })
                );
            }

            menuContainer.appendChild(
                this.compileMeal(menuDay.getBreakfest(), Localization.BREAKFAST_LABEL)
            );

            menuContainer.appendChild(
                this.compileMeal(menuDay.getLunch(), Localization.LUNCH_LABEL)
            );

            menuContainer.appendChild(
                this.compileMeal(menuDay.getSupper(), Localization.SUPPER_LABEL)
            );

            return menuContainer;

        }else{
            throw new Error("wrong type. Can't convert " + typeof(menuDay) + " to MenuDay");
        }
    },

    compileMenuDaysList: function(menuDaysList){
        if (menuDaysList instanceof MenuDaysList){
            var container = buildElement('div', {
                class: CSSClass.MENU_DAYS_LIST
            });

            for (var i = 0; i < menuDaysList.count(); i++){
                container.appendChild(
                    this.compileMenuDay(
                        menuDaysList.get(i),
                        Localization.MENU_DAY_TITLE + ' ' + i + ': '
                    )
                );
            }

            return container;
        }else{
            throw new Error("wrong type. Can't convert " + typeof(menuDay) + " to MenuDaysList");
        }
    },

    fixValidateModel: function(){
        var settingsDaysCount = GroupSettings.getDaysCount(),
            modelDaysCount = this.model.days.count();

        if (settingsDaysCount > modelDaysCount){
            for (var i = modelDaysCount; i < settingsDaysCount; i++){
                this.model.days.add(
                    new MenuDay()
                );
            }
        }else if ( settingsDaysCount < modelDaysCount ){
            for (var i = modelDaysCount; i > settingsDaysCount; i--){
                this.model.days.remove(this.model.days.count() -1);
            }
        }
    },

    renderModel: function(){
        this.fixValidateModel();

        this.clear();

        this.getMenuDomContainer().appendChild(this.compileMenuDaysList(this.model.days));
    },

    selected: {
        meal: null,
        day: null
    },

    model: {
        days: new MenuDaysList()
    },

    lastMealClickedEvent: null
};

GlobalObserver.subscribe(Event.APPLY_BUTTON_CLICKED, function(){
    DailyMenu.renderModel();
});

GlobalObserver.subscribe(Event.MEAL_CLICKED, function(data){
    if (DailyMenu.selected.meal){
        DailyMenu.selected.meal.removeClass(CSSClass.SELECTED);
    }
    if (DailyMenu.selected.day){
        DailyMenu.selected.day.removeClass(CSSClass.SELECTED);
    }

    data.sender.toggleClass(CSSClass.SELECTED);
    data.sender.parentNode.addClass(CSSClass.SELECTED);

    DailyMenu.selected.meal = data.sender;
    DailyMenu.selected.day = data.sender.parentNode;

    DailyMenu.lastMealClickedEvent = data;
});

GlobalObserver.subscribe(Event.ADD_DISH_BUTTON_CLICKED, function(data){
    var selectedDishes = DishList.getSelected();
    if (selectedDishes instanceof Array
        && selectedDishes.length > 0){
        var selectedMeal = DailyMenu.lastMealClickedEvent.objSender;

        for (var i = 0; i < selectedDishes.length; i++){
            selectedMeal.addDish(selectedDishes[i]);
        }

        DailyMenu.renderModel();
    }
});