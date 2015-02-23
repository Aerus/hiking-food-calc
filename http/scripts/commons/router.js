/**
 * Created by Serhii_Kotyk on 1/3/14.
 */
var Router = {
    getDishNames : function(){
        var names = new Array(),
            dishes = this.getDishes();


        for(var i = 0; i < dishes.length; i++){
            names.push(dishes[i].name);
        }

        return names;
    },

    getDishes: function(){
        return DbWrap.getDishes();
    }
};