$("button#reset").on("click", function() {
    chrome.storage.local.clear(function() {
        alert('Voila !');
    })
});
