/**
 * Created by Serhii_Kotyk on 1/13/14.
 */
/**
 * Global observer available for whole page
 * @type {Observer}
 */
var GlobalObserver = new Observer();

var __i = 0;

var Event = {
    APPLY_BUTTON_CLICKED: __i++,
    MEAL_CLICKED: __i++,
    ADD_DISH_BUTTON_CLICKED: __i++,
    DISHES_ADDED: __i++,
    REMOVE_DISH_BUTTON_CLICKED: __i++,
    ADD_DISH_BUTTON_VISIBLE_STATE_CHANGED: __i++,
    CLEAR_BUTTON_CLICKED: __i++,
    MEAL_DISH_CLICKED: __i++,
    DISH_LIST_CHANGED: __i++,
    DISH_LIST_CHECKED_STATE_CHANGE: __i++,
    DISH_CHECKED: __i++,
    DISH_UNCHECKED: __i++,
    DISH_DROP_BUTTON_CLICKED: __i++,
    MEAL_DISH_SELECTION_CHANGED: __i++,
    MEAL_DISH_SELECTED: __i++,
    MEAL_DISH_UNSELECTED: __i++,
    MEAL_SELECTION_CHANGED: __i++,
    MEAL_SELECTED: __i++,
    MEAL_UNSELECTED: __i++
};

var Request = {
    UPDATE_ADD_DISH_BUTTON_VISIBLE: __i++
};

var CSSClass = {
    SELECTED: 'selected',
    MEAL: 'meal',
    DISH: 'dish',
    MEAL_LABEL: 'meal-label',
    MENU_DAY: 'menu-day',
    MENU_DAY_LABEL: 'menu-day-label',
    MENU_DAYS_LIST: 'menu-days-list',
    HIDDEN: 'hidden',
    BUTTON: 'button',
    BUTTON_DROP: 'button-drop'
};