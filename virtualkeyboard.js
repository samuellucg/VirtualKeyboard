// virtual keyboard code


window.addEventListener("resize", function() { // Para cada redimensionamento o teclado será fechado caso esteja aberto.
    closeKeyboard();
})


const keyboard = document.getElementById("keyboardmod")
const searchbar = document.getElementById("searchbar");
let searchbarInput = document.getElementById("search-0");
let modal;
let offsetX = 0, offsetY = 0, isTouch = false;


function openKeyboard() { // To open keyboard and let draggable.
    modal = $("#keyboardmod")

    // unificar jquery.


    // Adicionar aria-hidden e role="dialog" ao teclado para melhorar a acessibilidade.

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

        keyboard.addEventListener("pointerdown",startTouch);
    }
    else{
        alert("O teclado já está aberto, para fechar. Clique no botão X")
        // toast ou snackbar
    }
}

function startTouch(e) { // pointerdown function
    if (e.pointerType !== "touch") return ;

    isTouch = true;
    const kbdim = keyboard.getBoundingClientRect();
    offsetX = e.clientX - kbdim.left;
    offsetY = e.clientY - kbdim.top;

    document.addEventListener("pointermove", touchMove);
    document.addEventListener("pointerup", touchEnd);
}

function touchMove(e) { // pointermove function
    if (!isTouch) return;

    let newX = e.clientX - offsetX
    let newY = e.clientY - offsetY

    const maxX = window.innerWidth - keyboard.offsetWidth;
    const maxY = window.innerHeight - keyboard.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))

    keyboard.style.left = `${newX}px`;
    keyboard.style.top = `${newY}px`;
}

function touchEnd() { // pointerup function
    isTouch = false;

    document.removeEventListener("pointermove",touchMove)
    document.removeEventListener("pointerup",touchEnd)
}


function closeKeyboard(){ // Just close keyboard.
    if(keyboard.style.display != "none"){
        keyboard.style.display = "none";
        searchbar.style.display = "none";
        clearSearch();
    }
}

function typeKey(val) { // LOL, you need to read to know his funcionality?
    searchbarInput.value += val
}

function clearSearch() { // Bro, you kidding me?
    searchbarInput.value = ""
}

function backspace() { // I give up.
    searchbarInput.value = searchbarInput.value.slice(0,-1)
}