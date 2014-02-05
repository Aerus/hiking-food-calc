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
                //use anonym function to avoid scope conflicts
                //and ovverides of veriables in loop
                var dishel = function (meal){
                    var currentDish = meal.getDish(i),
                        dishElement = buildElement('span', {
                            class: CSSClass.DISH,
                            innerText: currentDish
                        });

                    dishElement.onclick = function(event){
                        GlobalObserver.publish(Event.MEAL_DISH_CLICKED, {
                            event: event,
                            sender: dishElement,
                            dish: currentDish,
                            meal: meal
                        });
                    };
                    return dishElement;

                }(meal);

                mealContainer.appendChild(dishel);
            }

            mealContainer.onclick = function(event){
                GlobalObserver.publish(Event.MEAL_CLICKED, {
                    event: event,
                    sender: mealContainer,
                    meal: meal
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
        this.dropSelection();
        this.fixValidateModel();

        this.clear();

        this.getMenuDomContainer().appendChild(this.compileMenuDaysList(this.model.days));
    },

    selected: {
        meal: null,
        mealObj: null,
        day: null,
        dish: null,
        dishObj: null
    },

    dropSelection: function(){
        for(var key in this.selected){
            this.selected[key] = null;
        }
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
    if (DailyMenu.selected.meal != data.sender){
        if (DailyMenu.selected.meal){
            GlobalObserver.publish(Event.MEAL_UNSELECTED, {
                event: data.event,
                sender: DailyMenu.selected.meal
            });
        }
        GlobalObserver.publish(Event.MEAL_SELECTED, data);
        GlobalObserver.publish(Event.MEAL_SELECTION_CHANGED, data);

        if (DailyMenu.selected.day){
            DailyMenu.selected.day.removeClass(CSSClass.SELECTED);
        }

        data.sender.parentNode.addClass(CSSClass.SELECTED);

        DailyMenu.selected.day = data.sender.parentNode;
    }
});

GlobalObserver.subscribe(Event.MEAL_UNSELECTED, function(data){
    if (data.sender){
        data.sender.removeClass(CSSClass.SELECTED);
    }
    DailyMenu.selected.meal = null;
    DailyMenu.selected.mealObj = null;
});

GlobalObserver.subscribe(Event.MEAL_SELECTED, function(data){
    data.sender.addClass(CSSClass.SELECTED);
    DailyMenu.selected.meal = data.sender;
    DailyMenu.selected.mealObj = data.meal;
});

GlobalObserver.subscribe(Event.MEAL_SELECTION_CHANGED, function(data){
    if (!data.event.srcElement.isClass(CSSClass.DISH))
    if (DailyMenu.selected.meal
        || DailyMenu.selected.mealObj){
        GlobalObserver.publish(Event.MEAL_DISH_UNSELECTED, {
            event: data.event,
            sender: DailyMenu.selected.dish,
            dish: DailyMenu.selected.dishObj
        });
    }
});

GlobalObserver.subscribe(Event.ADD_DISH_BUTTON_CLICKED, function(data){
    var selectedDishes = DishList.getSelected();
    if (selectedDishes instanceof Array
        && selectedDishes.length > 0){
        var selectedMeal = DailyMenu.selected.mealObj;

        if (selectedMeal){
            for (var i = 0; i < selectedDishes.length; i++){
                selectedMeal.addDish(selectedDishes[i]);
            }

            DailyMenu.renderModel();
        }else{
            alert(Localization.MEAL_UNSELECTED_MESSAGE);
        }
    }
});

GlobalObserver.subscribe(Event.MEAL_DISH_CLICKED, function(data){
    if (DailyMenu.selected.dish){
        GlobalObserver.publish(Event.MEAL_DISH_UNSELECTED, {
            event: data.event,
            sender: DailyMenu.selected.dish
        });
    }

    GlobalObserver.publish(Event.MEAL_DISH_SELECTED, data);
    GlobalObserver.publish(Event.MEAL_DISH_SELECTION_CHANGED, data);
});

GlobalObserver.subscribe(Event.MEAL_DISH_SELECTED, function(data){
    if (data.sender){
        data.sender.addClass(CSSClass.SELECTED);
    }
    DailyMenu.selected.dish = data.sender;
    DailyMenu.selected.dishObj = data.dish;
    MenuControls.showRemoveDishButton();
});

GlobalObserver.subscribe(Event.MEAL_DISH_UNSELECTED, function(data){
    if (data.sender){
        data.sender.removeClass(CSSClass.SELECTED);
    }
    DailyMenu.selected.dish = null;
    DailyMenu.selected.dishObj = null;
    MenuControls.hideRemoveDishButton();
});

GlobalObserver.subscribe(Event.REMOVE_DISH_BUTTON_CLICKED, function(){
    if (DailyMenu.selected.dish
        && DailyMenu.selected.meal){
        if (DailyMenu.selected.dishObj
            && DailyMenu.selected.mealObj){
            DailyMenu.selected.mealObj.remove(DailyMenu.selected.dishObj);
            DailyMenu.renderModel();
        }
    }
});

GlobalObserver.subscribe(Event.MEAL_DISH_SELECTION_CHANGED, function(){
    if (DailyMenu.selected.dish){
        MenuControls.showAddDishButton();
    }else{
        MenuControls.hideAddDishButton();
    }
});