/**
 * Created by Serhii_Kotyk on 4/23/14.
 */
GlobalObserver.subscribe(Event.CALCULATE_BUTTON_CLICK, function(message){

        function getherDishes(){
            var merged = [],
                collection = DailyMenu.model.days;

            function mergeDish(dish){
                merged.push(dish);
            }

            function mergeMeal(meal){
                for(var i = 0; i < meal.count(); i++){
                    mergeDish(meal.get(i));
                }
            }

            for(var i = 0; i < collection.count(); i++){
                var current = collection.get(i);

                mergeMeal(current.getBreakfest());
                mergeMeal(current.getLunch());
                mergeMeal(current.getSupper());
            }

            return merged;
        }


    function fillBuyPack(){
        var dishes = getherDishes(),
            merged = {};//{name:"", buy:1, pack: 1}

        function mergeProduct(product){
            if (merged[product.name]){
                merged[product.name].buy += product.buy;
                merged[product.name].pack += product.pack;
            }else{
                merged[product.name] = {}
                merged[product.name].buy = product.buy;
                merged[product.name].pack = product.pack;
            }
        }

        CalcDB.getCalculationsForOneMeal(dishes, GroupSettings.getPeopleCount(), function(transaction, results){
            for(var i = 0; i < results.rows.length; i++){
                mergeProduct(results.rows.item(i));
            }

            Results.Together.clear();

            for(var key in merged){
                merged[key]['name'] = key;
                Results.Together.addResults(merged[key]);
            }

            Results.Together.render();
        });


    }

    fillBuyPack();
});