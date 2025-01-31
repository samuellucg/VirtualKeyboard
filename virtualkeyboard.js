// virtual keyboard 
window.addEventListener("resize", function() {
    closeKeyboard();
})
const keyboard = document.getElementById("keyboardmod")
const searchbar = document.getElementById("searchbar");
let searchbarInput = document.getElementById("search-0");
let modal;



function openKeyboard() {
    modal = $("#keyboardmod")
    if (keyboard.style.display != "flex") {
        keyboard.style.display = "flex";
        searchbar.style.display = "flex";
        console.warn("dimensões sem indice:",keyboard.getBoundingClientRect())
        modal.draggable({
            containment: "window",
            start: function () {
                modal.css("cursor", "grabbing");
                $("body").css("user-select", "none");
            },
            stop: function () {
                modal.css("cursor", "grab");
                $("body").css("user-select", "");
            }
        });
    }
    else{
        alert("O teclado já está aberto, para fechar. Clique no botão X")
    }
}

function setPosition() {
    if (!modal) return {left: 0, maxLeft: 0, top: 0, maxTop: 0}
}


function closeKeyboard(){
    if(keyboard.style.display != "none"){
        keyboard.style.display = "none";
        searchbar.style.display = "none";
        clearSearch();
    }
}

function typeKey(val) {
    searchbarInput.value += val
}

function clearSearch() {
    searchbarInput.value = ""
}

function backspace() {
    searchbarInput.value = searchbar.value.slice(0,-1)
}