/**
 * Created by Serhii_Kotyk on 2/6/14.
 */
function DbManager(dbInstance){
    var database = null;

    this.setDB = function(db){
        if (db instanceof DB){
            database = db;
            return this;
        }else{
            throw new Error('Wrong type. DB expected');
        }
    };

    this.getDB = function(){
        return database;
    };

    if (dbInstance) {
        this.setDB(dbInstance);
    }

    this.execute = function(sql, params, callback, errorCallback){
        this.getDB().connection.transaction(function(tx){
            tx.executeSql(sql, params, callback, errorCallback);
        });
        return this;
    };

    this.select = function(sql, params, callback){
        this.execute(sql, params, function(tx, results){
            var len = results.rows.length,
                i,
                items = [];
            for (i = 0; i < len; i++) {
                items.push(results.rows.item(i));
            }

            callback(items);
        }, function(e){console.log(e);});
    };
};

Class('DbManager', DbManager);

DbManager.getInstance = function(){
    var instance = new DbManager();
    DbManager.getInstance = function(){
        return instance;
    }
    return instance;
};