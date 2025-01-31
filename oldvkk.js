let modal;
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("resize", () => {
        const limits = updateLimits();
        modal.hide();
        const position = modal.position();
        const newX = Math.max(limits.minX, Math.min(position.left, limits.maxX));
        const newY = Math.max(limits.minY, Math.min(position.top, limits.maxY));

        modal.css({ left: newX, top: newY });
    });

    $("#closekb").on("click", function () {
        modal = setModal();
        closeKeyboard();
    });

    modal = setModal();
    initializeDragEvents(modal);
});

function updateLimits() {
    if (!modal) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const modalWidth = 584;
    const modalHeight = 253;
    const modalRect = modal[0].getBoundingClientRect();

    return {
        minX: 10, // left
        maxX: window.visualViewport.width - modalWidth - 10, // right
        minY: -modalRect.top, // up
        maxY: window.innerHeight - modalHeight - 106 // down
    };
}

function setInitialPosition() {
    if (!modal) return;

    modal.css({ width: "584px", height: "253px" });

    const initialXPos = (window.innerWidth - modal.outerWidth()) / 2;
    const initialYPos = (window.innerHeight - modal.outerHeight()) / 2;

    modal.css({ left: initialXPos, top: initialYPos });
}

function initializeDragEvents(modalElement) {
    modal = $(modalElement);
    setInitialPosition();

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

    modal.on("pointerdown", function (event) {
        if (event.pointerType !== "touch") return;
        const startX = event.pageX - modal.offset().left;
        const startY = event.pageY - modal.offset().top;

        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        const modalWidth = modal.outerWidth();
        const modalHeight = modal.outerHeight();

        $(document).on("pointermove", function (event) {
            let newX = event.pageX - startX;
            let newY = event.pageY - startY;

            newX = Math.max(0, Math.min(newX, windowWidth - modalWidth));
            newY = Math.max(0, Math.min(newY, windowHeight - modalHeight));

            modal.css({ left: newX, top: newY });
        });

        $(document).on("pointerup", function () {
            $(document).off("pointermove pointerup");
        });

        event.preventDefault();
    });

}

// Virtual Keyboard ↓.

function openCloseKeyboard() {
    modal = setModal();
    toggleKeyboard(modal);
    initializeDragEvents(modal);
}

function setModal() {
    return $("#keyboardmod");
}

function isTabBars() {
    const isSelected = $("#tab-bars").attr("aria-selected") === "true";
    return isSelected;
}

function toggleKeyboard(mod) {
    const keyboard = mod;
    if (keyboard.css("display") != "flex") {
        keyboard.css("display", keyboard.css("display") === 'none' || keyboard.css("display") === '' ? 'flex' : 'none');
    }
}

function DefineSearchBar() {
    if (isTabBars()) {
        return $('#dt-search-0');
    } else {
        return $('#dt-search-1');
    }
}

function typeKey(key) {
    const searchBar = DefineSearchBar();

    searchBar.val(searchBar.val() + key);
    filterTable();
}

function backspace() {
    const searchBar = DefineSearchBar();

    searchBar.val(searchBar.val().slice(0, -1));
    filterTable();
}

function clearSearch() {
    const searchBar = DefineSearchBar();

    searchBar.val('');
    filterTable();
}

function filterTable() {
    let input = '';
    if (isTabBars()) {
        input = $('#dt-search-0').val();
        $('#barsTable').DataTable().search(input).draw();
    } else {
        input = $('#dt-search-1').val();
        $('#batchTable').DataTable().search(input).draw();
    }
}

function closeKeyboard() {
    const keyboard = setModal();
    if (keyboard.css("display") != 'none')
        keyboard.css("display", 'none');
}