/**
 * Created by Serhii_Kotyk on 2/6/14.
 */
function DB(dbName){
    var name = dbName || 'default',
        version = '1.0',
        displayName = 'database',
        size = 256 * 1024 * 1024;//256kb

    this.name = name;

    this.connection = openDatabase(this.name, version, displayName, size);
};

Class('DB', DB);
