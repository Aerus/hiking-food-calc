/**
 * Created by Serhii_Kotyk on 1/13/14.
 */
/**
 * Global observer available for whole page
 * @type {Observer}
 */
var GlobalObserver = new Observer();

var Event = {
    APPLY_BUTTON_CLICKED: 0,
    MEAL_CLICKED: 1,
    ADD_DISH_BUTTON_CLICKED: 2,
    REMOVE_DISH_BUTTON_CLICKED: 3,
    CLEAR_BUTTON_CLICKED: 4
};

var CSSClass = {
    SELECTED: 'selected',
    MEAL: 'meal',
    DISH: 'dish',
    MEAL_LABEL: 'meal-label',
    MENU_DAY: 'menu-day',
    MENU_DAY_LABEL: 'menu-day-label',
    MENU_DAYS_LIST: 'menu-days-list'
};