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
    }
};