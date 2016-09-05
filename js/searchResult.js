function save() {

    var journeyKey = $("#origin").val() + " -> " + $("#destination").val();

    var progress = 100
    if ($(".ui-progressbar-value") !== null)
        progress = Math.round($(".ui-progressbar-value").width() / $(".ui-progressbar-value").offsetParent().width() * 100);

    console.log("Waiting..." + progress + "%");
    document.title = progress + "% - " + journeyKey;

    if (progress == 100 || !Number.isInteger(progress)) {
        chrome.storage.local.get('storedPrices', function(result) {

            if (result.storedPrices instanceof Object == false)
                result.storedPrices = {};

            if (result.storedPrices[journeyKey] instanceof Object == false)
                result.storedPrices[journeyKey] = {};

            $(".flexdatesmatrix .actionlink").each(function() {
                var matches = $(this).attr("href").match(/javascript: FilterList\.flexFilterToDates\(\'([0-9]*)\', null\, ([0-9]*)\)/)
                console.log(matches[1] + " : " + matches[2]);

                result.storedPrices[journeyKey][matches[1]] = matches[2];
            });

            chrome.storage.local.set({
                'storedPrices': result.storedPrices
            }, function() {
                console.log("saved");
                if (window.location.href.indexOf("#autoclose") > -1) {
                    window.close();
                }
            });
        })
    } else {
        setTimeout(function() {
            save();
        }, 1000);
    }

}

$(".keel-grid.verticalsGrid").append('<div class="col-hidden col-vertical-l">' +
    '<a id="crawl-link" style="color:red" >Crawl the next 10 weeks !</a></div>');

$("#crawl-link").on("click", function() {

    var splitUrl = window.location.href.match(/(.*\/)([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9])\.*/);
    var currentDate = new Date(splitUrl[2]);
    for (i = 0; i < 10; i++) {
        var newDate = new Date(currentDate.setTime(currentDate.getTime() + 7 * 86400000));
        window.open(splitUrl[1] + newDate.toISOString().substring(0, 10) + "-flexible#autoclose", '_blank');
    }
});

save();
