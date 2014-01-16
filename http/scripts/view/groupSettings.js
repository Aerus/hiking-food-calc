/**
 * Created by Serhii_Kotyk on 1/16/14.
 */
var GroupSettings = {
    getPeopleCount: function(){
        var val = document.getElementById('peopleCount').value;
        return val === "" ? 0 : parseInt(val);
    },

    getDaysCount: function(){
        var val = document.getElementById('daysCount').value;
        return val === "" ? 0 : parseInt(val);
    }
};