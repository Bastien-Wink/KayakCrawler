$('button#reset').on('click', () => {
    chrome.storage.local.clear(() => {
        alert('Voila !');
    });
});

$('button#export').on('click', () => {
    chrome.storage.local.get(['storedPrices'], result => {
    	if (result.storedPrices instanceof Object == false) {
    		result.storedPrices = {};
    	}

    console.log('getting storedPrices');

    $.each(result.storedPrices, (journeyKey, value) => {
        $('body').before(journeyKey + '<br/>');
        let lower = 999999;
        $.each(value, (date, price) => {
        	if (price < price.replace( /^\D+/g, '')) {
        		lower = price.replace( /^\D+/g, '');
        	}
            $('body').before(date + '-><span class=\'' + strhash(journeyKey) + price.replace( /^\D+/g, '') + '\'>' + price + '<br/>');
        });
        console.log(lower)
        $('.' + strhash(journeyKey) + lower).css('color', 'red');
        $('body').before('<br/>');
    });
    //  $("body").before(JSON.stringify(result, null, 2));
    });
});