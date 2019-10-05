var countText = L.DomUtil.create('h5');
countText.innerHTML = "";
countText.style.color = "white";
var countContainer = L.DomUtil.create('div');
var customControlCount = L.control.Settings = L.Control.extend({
    options: {
        position: 'topleft'
    },
    initialize: function(options){

    },
    onAdd: function(map) {
        
        countContainer.appendChild(countText);
        countContainer.appendChild(AirportTableContainer)
        return countContainer;
    },

    onRemove: function(map) {
        //L.DomEvent.off();
    }
});
L.control.Settings = function(opts){
    return new L.Control.Settings(opts);
}