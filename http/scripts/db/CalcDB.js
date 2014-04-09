/**
 * Created by Serhii_Kotyk on 3/26/14.
 */
var CalcDB = {
    manager: new DbManager().setDB(new DB('calcdb')),

    createIfNotExistDishesTable: function(trueCallback, falseCallback){
        this.manager.execute('CREATE TABLE IF NOT EXISTS Dishes (did unique, name)', null, trueCallback, falseCallback);
    },

    createIfNotExistProductsTable: function(trueCallback, falseCallback){
        this.manager.execute('CREATE TABLE IF NOT EXISTS Products (pid unique, name, normPerOne, shrinkage)', null, trueCallback, falseCallback);
    },

    createIfNotExistProductsInDishesTable: function(trueCallback, falseCallback){
        this.manager.execute('CREATE TABLE IF NOT EXISTS ProductsInDishes (did, pid)', null, trueCallback, falseCallback);
    },

    createTablesIfNotExist: function(){
        this.createIfNotExistDishesTable();
        this.createIfNotExistProductsTable();
        this.createIfNotExistProductsInDishesTable();
    },

    contentExistsTable: function(tableName, trueCallback, falseCallback){
        this.manager.execute('SELECT COUNT * FROM ' + tableName, null, function(data){
            if (data && data.length > 0){
                trueCallback && trueCallback(data);
            }else{
                falseCallback && falseCallback(data);
            }
        }, falseCallback);
    },

    contentExistsDishes: function(trueCallback, falseCallback){
        this.contentExistsTable('Dishes', trueCallback, falseCallback);
    },

    contentExistsProducts: function(trueCallback, falseCallback){
        this.contentExistsTable('Products', trueCallback, falseCallback);
    },

    contentExistsProductsInDishes: function(trueCallback, falseCallback){
        this.contentExistsTable('ProductsInDishes', trueCallback, falseCallback);
    },

    dropTable: function(tableName, callBack, errorCallBack){
        this.manager.execute('DROP TABLE IF EXISTS ' + tableName, null, callBack, errorCallBack);
    },

    dropTableDishes: function(callBack, errorCallBack){
        this.dropTable('Dishes', callBack, errorCallBack);
    },

    dropTableProducts: function(callBack, errorCallBack){
        this.dropTable('Products', callBack, errorCallBack);
    },

    dropTableProductsInDishes: function(callBack, errorCallBack){
        this.dropTable('ProductsInDishes', callBack, errorCallBack);
    },

    reinitDishesAndProductsInDishesTables: function(callBack, errorCallBack){
        var self = this,
            data = TableDishesMokup,
            queue = new AsyncQueue();

        queue.onsuccess(callBack);

        queue.add(self.dropTableDishes, self)
            .add(self.dropTableProductsInDishes, self)
            .add(self.createIfNotExistDishesTable, self)
            .add(self.createIfNotExistProductsInDishesTable, self);

        for(var i = 0; i < data.length; i++){
            var current = data[i]
            queue.add(
                self.manager.execute,
                self.manager,
                [
                    'INSERT INTO Dishes (did, name) VALUES (?, ?)',
                    [current.id, current.name],
                    queue.getCallback(),
                    queue.getErrorCallback()
                ]
            );

            for (var j = 0; j < current.components.length; j++){
                var jcurrent = current.components[j]
                queue.add(
                    self.manager.execute,
                    self.manager,
                    [
                        'INSERT INTO ProductsInDishes (did, pid) VALUES (?, ?)',
                        [current.id, jcurrent],
                        queue.getCallback(),
                        queue.getErrorCallback()
                    ]
                );
            }
        }

        queue.start();
        return queue;
    },

    reinitProductsTable: function(callBack, errorCallBack){
        var self = this,
            data = TableProductsMokup,
            queue = new AsyncQueue();

        queue.onsuccess(callBack);

        queue.add(self.dropTableProducts, self)
            .add(self.createIfNotExistProductsTable, self);

        for(var i = 0; i < data.length; i++){
            var current = data[i];

            queue.add(
                self.manager.execute,
                self.manager,
                [
                    'INSERT INTO Products (pid, name, normPerOne, shrinkage) VALUES (?, ?, ?, ?)',
                    [
                        current.productId,
                        current.productName,
                        current.normPerOne,
                        current.shrinkage
                    ],
                    queue.getCallback(),
                    queue.getErrorCallback()
                ]
            );
        }

        queue.start();
        return queue;
    },

    /*
    * вот расчеты
     Блок "Упаковка"
     - "первое" =
     продукт1*norm_per_one*people
     продукт2*norm_per_one*people
     ............
     Блок "Закупка"
     - продукт1 = кол-во_раз_когда_продукт_встречается_в_раскладке*norm_per_one*people*shrinkage
    * */

    getCalculationsForOneMeal: function(dishesArray, numberOfPeople, callBack, errorCallBack){
        function getBuyCalculationSql(){
            var q = "SELECT " +
                "p.name " +
                    ", SUM(p.normPerOne * @people * p.shrinkage) as buy " +
                    ", SUM(p.normPerOne * @people2) as pack " +
                "FROM " +
                "Products p , Dishes d , ProductsInDishes pd " +
                "WHERE " +
                "p.pid = pd.pid " +
                "AND d.did = pd.did " +
                "AND d.name IN (@dishes) " +
                "GROUP BY " +
                "p.name",
                    q = q.replace('@people', numberOfPeople)
                        .replace('@people2', numberOfPeople)
                        .replace('@dishes', "'" + dishesArray.join("', '") + "'");
            return q;
        }

        this.manager.execute(
            getBuyCalculationSql(),
            null,
            callBack,
            errorCallBack
        );

        return getBuyCalculationSql();
    }
};