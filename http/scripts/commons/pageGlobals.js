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
    CLEAR_BUTTON_CLICKED: 4,
    MEAL_DISH_CLICKED: 5,
    DISH_LIST_CHANGED: 6,
    DISH_LIST_CHECKED_STATE_CHANGE: 7,
    DISH_CHECKED: 8,
    DISH_UNCHECKED: 9,
    MEAL_DISH_SELECTION_CHANGED: 10,
    MEAL_DISH_SELECTED: 11,
    MEAL_DISH_UNSELECTED: 12,
    MEAL_SELECTION_CHANGED: 13,
    MEAL_SELECTED: 14,
    MEAL_UNSELECTED: 15
};

var CSSClass = {
    SELECTED: 'selected',
    MEAL: 'meal',
    DISH: 'dish',
    MEAL_LABEL: 'meal-label',
    MENU_DAY: 'menu-day',
    MENU_DAY_LABEL: 'menu-day-label',
    MENU_DAYS_LIST: 'menu-days-list',
    HIDDEN: 'hidden'
};