var caret = L.DomUtil.create('img');
caret.src = "caret.svg"
caret.style.height = '20px';
var containter = L.DomUtil.create('div');
containter.id = "container";


var text = L.DomUtil.create('h5');
text.innerHTML = "";
text.style.color = "red";
text.style.display = "inline";
text.style.marginRight = "15px";
caret.onclick = function(){
    containter.removeChild(caret); 
    buttonVisibility(true);

    
};

var addPlane = L.DomUtil.create('input');
var hideDiv = L.DomUtil.create('input');
var hideCursor = L.DomUtil.create('input');
hideCursor.type = 'button';
        hideCursor.onclick = function(){
            document.getElementsByClassName("leaflet-control-zoom")[0].style.visibility = "hidden";       

            document.body.requestPointerLock();

        };
hideCursor.value = 'Hide Cursor and Buttons';

addPlane.type = 'button';
        addPlane.onclick = function(){
            window.location.href = "/Input";
            
        };
        addPlane.value = 'Add Planes';
        
        
        hideDiv.type = 'button';
        hideDiv.onclick = function(){
            
            buttonVisibility(false, true);

            containter.appendChild(caret);

            
        };
        hideDiv.value = 'Hide Buttons';

var customControl = L.Control.Settings = L.Control.extend({
    options: {
        position: 'topright'
    },
    initialize: function(options){

    },
    onAdd: function(map) {
        
        containter.appendChild(text);
        containter.appendChild(FlightXMLButton);
        containter.appendChild(ChangeAllButton);

        containter.appendChild(NumberInputForm);
        containter.appendChild(addPlane);
        
        containter.appendChild(hideDiv);
        containter.appendChild(hideCursor);
        return containter;
    },

    onRemove: function(map) {
        //L.DomEvent.off();
    }
});
L.control.Settings = function(opts){
    return new L.Control.Settings(opts);
}

function buttonVisibility(state, caretVisibility){
    if(state == true){
        addPlane.style.visibility = "visible";
        hideDiv.style.visibility = "visible";
        hideCursor.style.visibility = "visible";
        ChangeAllButton.style.visibility = "visible";

        text.style.visibility = "visible";
        FlightXMLButton.style.visibility = "visible";
        NumberInputForm.style.visibility = "visible";

        countContainer.style.visibility = "visible"

    }
    else{
        addPlane.style.visibility = "hidden";
        hideDiv.style.visibility = "hidden";
        hideCursor.style.visibility = "hidden";
        text.style.visibility = "hidden";
        FlightXMLButton.style.visibility = "hidden";
        NumberInputForm.style.visibility = "hidden";
        ChangeAllButton.style.visibility = "hidden";

        countContainer.style.visibility = "hidden"


    }
    if(caretVisibility){
        caret.style.visibility = "visible";
    } else if (!caretVisibility){
        caret.style.visibility = "hidden";
    }
}
document.addEventListener('pointerlockchange', lockChangeAlert, false);
function lockChangeAlert() {
    if (document.pointerLockElement != null){
        //locked
      
      buttonVisibility(false, false);
    } else {
    //unlocked
      document.getElementsByClassName("leaflet-control-zoom")[0].style.visibility = "visible";       

      buttonVisibility(true,true);

      //document.removeEventListener("mousemove", false);
    }
  }



function UpdateText(reqValue) {
    let cost = reqValue * .0120
    text.innerHTML = reqValue + " FlightXML Requests "+ "* $.0120 ="+  " $" + cost

}