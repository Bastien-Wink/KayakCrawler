function strhash(str) {
    if (str.length % 32 > 0) str += Array(33 - str.length % 32).join("z");
    var hash = '',
        bytes = [],
        i = j = k = a = 0,
        dict = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
    }
    var chunk_len = Math.ceil(bytes.length / 32);
    for (i = 0; i < bytes.length; i++) {
        j += bytes[i];
        k++;
        if ((k == chunk_len) || (i == bytes.length - 1)) {
            a = Math.floor(j / k);
            if (a < 32)
                hash += '0';
            else if (a > 126)
                hash += 'z';
            else
                hash += dict[Math.floor((a - 32) / 2.76)];
            j = k = 0;
        }
    }
    return hash;
}

chrome.storage.local.get(['storedPrices'], function(result) {

    if (result.storedPrices instanceof Object == false)
        result.storedPrices = {};

    $.each(result.storedPrices, function(journeyKey, value) {
        $("body").before(journeyKey + "<br/>");
        var lower = 999999;
        $.each(value, function(date, price) {
            if (price < lower) lower = price;
            $("body").before(date + "-><span class='" + strhash(journeyKey) + price + "'>" + price + "<br/>");
        })
        $("." + strhash(journeyKey) + lower).css('color', 'red');
        $("body").before("<br/>");

    })




    //  $("body").before(JSON.stringify(result, null, 2));
});
