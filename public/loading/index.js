(function () {
    var content = document.getElementById("zyao89-loading-text");
    content.innerHTML = content.innerHTML.split("")
        .map(function (letter, i) {
            var className;
            if (i > 0 && i < content.innerText.length - 1) {
                className = "yoyo-x-" + i % 6;
            }
            if (letter.trim() === "") {
                className += " blank";
            }
            return '<span class="' + className + '">' + letter + "</span>";
        })
        .join("");
})();
