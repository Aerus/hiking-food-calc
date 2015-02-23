/**
 * Created by Serhii_Kotyk on 1/28/14.
 */

var Meal = function(){
    var dishes = [];

    this.getDish = function(id){
        return dishes[id];
    };

    this.get = this.getDish;

    this.addDish = function(dish){
        if (typeof dish === 'string'
            && !this.contains(dish)){
            dishes.push(dish);
        }else{
            throw new Error("Can't add not string dish name");
        }
        return this;
    };

    this.clear = function(){
        dishes = [];
        return this;
    };

    this.contains = function(dish){
        if (typeof dish === 'string'){
            return dishes.indexOf(dish) !== -1;
        }else{
            return false;
        }
    };

    this.dishCount = function(){
        return dishes.length;
    };

    this.count = this.dishCount;

    this.indexOf = function(el){
        return dishes.indexOf(el);
    };

    this.remove = function(el){
        var index = this.indexOf(el);
        if (index >= 0){
            dishes.splice(index, 1);
        }
    };

    this.toArray = function(){
        var array = new Array();
        for(var i = 0; i < this.dishCount(); i++){
            array.push(this.getDish(i));
        }
        return array;
    };

};

Class('Meal', Meal);

var MenuDay = function(){
    var breakfest = new Meal(),
        lunch = new Meal(),
        supper = new Meal();

    this.getBreakfest = function(){
        return breakfest;
    };

    this.getLunch = function(){
        return lunch;
    };

    this.getSupper = function(){
        return supper;
    };

    this.setBreakfest = function(meal){
        breakfest = meal;
        return this;
    };

    this.setLunch = function(meal){
        lunch = meal;
        return this;
    };

    this.setSupper = function(meal){
        supper = meal;
        return this;
    };

    this.toJson = function(){
        return {
            breakfest: this.getBreakfest(),
            lunch: this.getLunch(),
            supper: this.getSupper()
        };
    };
};

Class('MenuDay', MenuDay);

var MenuDaysList = function(){
    var list = new Array();

    this.add = function(menuDay){
        if (menuDay instanceof MenuDay){
            list.push(menuDay);
            return this;
        }else{
            throw new Error("Can't add not instance of MenuDay");
        }
    };

    this.clear = function(){
        list.clear();
        return this;
    };

    this.count = function(){
        return list.length;
    };

    this.remove = function(objectOrIndex){
        if (objectOrIndex instanceof MenuDay){
            return this.remove(list.indexOf(objectOrIndex));
        }else if (typeof objectOrIndex === 'number'
            && objectOrIndex > -1){
            list.splice(objectOrIndex, 1);
            return this;
        }else{
            return this;
        }
    };

    this.get = function(index){
        return list[index];
    };
};

Class('MenuDaysList', MenuDaysList);