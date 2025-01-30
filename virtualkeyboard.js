let isDragging = false;
let currentX = 0, currentY = 0, initialX = 0, initialY = 0, offsetX = 0, offsetY = 0;
let modal;

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("resize", () => {
        const limits = updateLimits();
        modal.style.display = "none"
        currentX = Math.max(limits.minX, Math.min(currentX, limits.maxX));
        currentY = Math.max(limits.minY, Math.min(currentY, limits.maxY));

        setTranslate(currentX, currentY, modal);
    });

    document.getElementById("closekb").addEventListener("click", function () {
        modal = setModal();
        closeKeyboard();
    });
});

function updateLimits() {
    if (!modal) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const modalWidth = 584;
    const modalHeight = 253;
    const modalRect = modal.getBoundingClientRect();

    return {
        minX: 10, // left
        maxX: window.visualViewport.width - modalWidth - 10, // right
        minY: -modalRect.top, // up
        maxY: window.innerHeight - modalHeight - 106 // down
    };
}

function setInitialPosition() {
    if (!modal) return;

    modal.style.width = "584px";
    modal.style.height = "253px";

    const initialXPos = (window.innerWidth - modal.offsetWidth) / 2;
    const initialYPos = (window.innerHeight - modal.offsetHeight) / 2;

    currentX = initialXPos;
    currentY = initialYPos;
    setTranslate(currentX, currentY, modal);
}

function initializeDragEvents(modalElement) {
    modal = modalElement;
    setInitialPosition();

    modal.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        const rect = modal.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;

        isDragging = true;
        modal.style.cursor = "grabbing";
        document.body.style.userSelect = "none";

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

function onMouseMove(e) {
    if (!isDragging) return;
    const newX = e.clientX - initialX;
    const newY = e.clientY - initialY;

    const limits = updateLimits();

    currentX = Math.max(limits.minX, Math.min(newX, limits.maxX));
    currentY = Math.max(limits.minY, Math.min(newY, limits.maxY));

    setTranslate(currentX, currentY, modal);
}

function setTranslate(x, y, element) {
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function onMouseUp() {
    isDragging = false;
    if (modal) {
        modal.style.cursor = "grab";
    }
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

// Virtual Keyboard ↓.

function openCloseKeyboard() {
    modal = setModal();
    toggleKeyboard(modal);
    initializeDragEvents(modal);
}

function setModal() {
    return document.getElementById("keyboardmod");
}

function isTabBars() {
    const isSelected = document.getElementById("tab-bars").getAttribute("aria-selected") === "true";
    return isSelected
}

function toggleKeyboard(mod) {
    const keyboard = mod;
    if (keyboard.style.display != "flex") {
        keyboard.style.display = keyboard.style.display === 'none' || keyboard.style.display === '' ? 'flex' : 'none';
    }
}

function DefineSearchBar() {
    if (isTabBars()) {
        return document.getElementById('dt-search-0');
    } else {
        return document.getElementById('dt-search-1');
    }
}

function typeKey(key) {
    const searchBar = DefineSearchBar();

    searchBar.value += key;
    filterTable();
}

function backspace() {
    const searchBar = DefineSearchBar();

    searchBar.value = searchBar.value.slice(0, -1);
    filterTable();
}

function clearSearch() {
    const searchBar = DefineSearchBar();

    searchBar.value = '';
    filterTable();
}

function filterTable() {
    let input = '';
    if (isTabBars()) {
        input = document.getElementById('dt-search-0').value;
        $('#barsTable').DataTable().search(input).draw();
    } else {
        input = document.getElementById('dt-search-1').value;
        $('#batchTable').DataTable().search(input).draw();
    }
}

function closeKeyboard() {
    const keyboard = setModal();
    if (keyboard.style.display != 'none')
        keyboard.style.display = 'none'
}