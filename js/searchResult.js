const weeks = 10;

function save() {
	const urlToJourneyRegex = /.*flights\/(.*)\/.*/g;
	const journeyKey = urlToJourneyRegex.exec(window.location)[1];

	const progress = 100;

	// Wait until the page is loader
	if ($('.Common-Results-ProgressBar .bar')[0].style.transform !== 'translateX(100%)' && $('[totalcolumns]').length == 0) {
		if (progress == 100 || !Number.isInteger(progress)) {
            chrome.storage.local.get('storedPrices', result => {
            	if (result.storedPrices instanceof Object == false) {
            		result.storedPrices = {};
            	}

            	if (result.storedPrices[journeyKey] instanceof Object == false) {
            		result.storedPrices[journeyKey] = {};
            	}

                $('.Flights-Results-React-FlexMatrix-container [role="rowgroup"] li div:nth-child(4)').each(function () {
                	const idToDateRegex = /.*__(\d\d\d\d)(\d\d)(\d\d)/g;
                	const dates = idToDateRegex.exec($(this).closest('li').attr('id'));

                	if (dates == null || !$.isNumeric($(this).html()[0])) {
                		return;
                	}

                	const dateStr = dates[1] + '-' + dates[2] + '-' + dates[3];

                    console.log('Kayak crawler - saving date ' + dateStr + ' price ' + $(this).html());
                    result.storedPrices[journeyKey][dateStr] = $(this).html();
                });

                console.log(result.storedPrices);

                chrome.storage.local.set({
                	storedPrices: result.storedPrices
                }, () => {
                    console.log('Kayak crawler - saved !');
                    if (window.location.href.indexOf('autoclose') > -1) {
                        window.close();
                    }
                });
            });
		} else {
            console.log("Kayak crawler - Waiting for page to be loaded");
            setTimeout(() => {
                save();
            }, 1000);
		}
	}
}

$('.inline-search-form-grid').append('<div class="col-hidden col-vertical-l" style="width: 100%;text-align: right;">' +
    '<a id="crawl-link" style="color: white; font-weight: bold">🐹 Crawl the next ' + weeks + ' weeks ! 🐹</a></div>');

$('#crawl-link').on('click', () => {
	const splitUrl = window.location.href.match(/(.*\/)(\d\d\d\d-\d\d-\d\d)\.*/);
	const currentDate = new Date(splitUrl[2]);
	for (i = 0; i < weeks; i++) {
		const newDate = new Date(currentDate.setTime(currentDate.getTime() + 7 * 86400000));
        window.open(splitUrl[1] + newDate.toISOString().substring(0, 10) + '-flexible?sort=bestflight_a&autoclose', '_blank');
	}
});

save();
