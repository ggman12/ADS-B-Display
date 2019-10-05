var table = document.getElementById("tbodyMain");
var tableRow = document.getElementById("planeRow");
var thisIsATable = true;
var focused = false
clearList();
populateList();



    function Focused() {
        focused = true
    }
    function DeFocus(params) {
        focused = false
    }
    function trashClick(button){
        var deletedTr = button.parentNode.parentNode;
        console.log(deletedTr);
        removePlane(deletedTr);
        deletedTr.remove();
    }
    function CreateRow(hexcode, tailNumber, _type, ID){
        var clone = tableRow.cloneNode(true);
        table.appendChild(clone);  
        clone.cells[0].innerHTML = hexcode;
        clone.cells[1].innerHTML = tailNumber;
      
        clone.cells[2].children[0].selectedIndex = IndexForType(_type); 
        clone.dataset.ID = ID

 
     

    }
    

    

    function clearList(){
         while(table.rows.length>0){
            
            table.deleteRow(0);
            
         }
        
    }
    function populateList(){
        Planes.forEach(plane => {
            CreateRow(plane.hexcode, plane.tailNumber, plane._type, plane.ID);
        });
    }
    function removePlane(TR){
        let id = TR.dataset.ID
        
        let xhttp = new XMLHttpRequest()
        xhttp.open("POST", "/deletePlane", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("ID=" + id);
    }
    
    // function requestHandler(data) {
    //     var url = '/deletePlane';
    //     Request.open('POST', url, true);
    //     Request.onreadystatechange = sendData;
    //     Request.send(data);
    // /*unless .send() is called, nothing moves forward..there will be no communication between the client and server,so here it also means when the request ready state changes from 1 to 2 , call sendData, similarly when it goes from 2 to 3 call sendData, and similarly for 3 to 4 , unless you dont call Request.send how will the readystate change, if readystate is not changing why will sendData be called at all.*/
    //   } 
    //   Request.send("apple");

    function Find_typeRowFromPlane(plane) {
        for (let i = 0; i < table.rows.length; i++) {
            let element = table.rows[i];
            let tableHex = element.cells[0].innerHTML;
            let tabletail = element.cells[1].innerHTML;
            console.log(element.cells[2].children[0])

            if (tableHex == plane.hexcode || tabletail == plane.tailNumber) {
                console.log(element.cells[2].children[0])
                return element.cells[2].children[0];
            }
        }
    }
    // function UpdateAllPlaneStatusPost() {
    //     Planes.forEach(plane => {
    //         let cell = Find_typeRowFromPlane(plane)
    //         if(cell[cell.selectedIndex] != plane._type){
    //             fetch("/ChangePlaneStatus",{ 
    //             method: 'post',
    //             body: JSON.stringify({plane: plane})
    //         })
    //         }
    //     });
    //     for (let i = 0; i < table.rows.length; i++) {
    //         let element = table.rows[i];
    //         let tableHex = element.cells[0].innerHTML;
    //         let tabletail = element.cells[1].innerHTML;
    //         var select = element.cells[2].children[0];
    //         select.dataset.lock = "false";

            
    // }
    
    // }
    var selectedThing
    function ChangeSelectedType(selected) {
        selectedThing = selected
        console.log(selected.children[selected.selectedIndex].innerHTML);
        let id = selectedThing.parentElement.parentElement.dataset.ID
        let type = selected.children[selected.selectedIndex].innerHTML
        let xhttp = new XMLHttpRequest()
        xhttp.open("POST", "/ChangePlaneType", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhttp.send("ID=" + id + "&type=" + type);
    }
    function TableUpdate(plane, isDelete) {
        if (focused == false) {
            // clearList()
            // populateList()
            for (let i = 0; i < table.rows.length; i++) {
                const element = table.rows[i];
                let tableHex = element.cells[0].innerHTML;
                let tabletail = element.cells[1].innerHTML;
                if (tableHex == plane.hexcode || tabletail == plane.tailNumber) {
                    if(isDelete){
                        table.deleteRow(i)
                        return
                    }else{
                        UpdateRow(plane, element)
                        return;
                    }
                    
                }
                
            }
        }
       
        // CreateRow(plane.hexcode, plane.tailNumber,plane._type, plane.ID)

    }
function UpdateRow(plane, row) {
    // var row = row
    row.cells[0].innerHTML = plane.hexcode;
    row.cells[1].innerHTML = plane.tailNumber;
    if(plane._type == "openSky"){
        row.cells[2].children[0].selectedIndex = 0

    }if(plane._type == "FlightXML"){
        row.cells[2].children[0].selectedIndex = 1
    }if(plane._type == "Not Live"){
        row.cells[2].children[0].selectedIndex = 2

    }
    var select = row.cells[2].children[0];
    
    //         select.dataset.lock = "false";
  

}
   
function IndexForType(type){
    if(type == "openSky"){
        return 0

    }if(type == "FlightXML"){
        return 1
    }if(type == "Not Live"){
        return 2;

    }
}


