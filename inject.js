// We are using some code to find all the elements that are in the Viewport.
// This translates to finding all the elements that are on the screen.

//https://github.com/benpickles/onScreen
;(function($) {
  $.expr[":"].onScreen = function(elem) {
    var $window = $(window)
    var viewport_top = $window.scrollTop()
    var viewport_height = $window.height()
    var viewport_bottom = viewport_top + viewport_height
    var $elem = $(elem)
    var top = $elem.offset().top
    var height = $elem.height()
    var bottom = top + height

    return (top >= viewport_top && top < viewport_bottom) ||
           (bottom > viewport_top && bottom <= viewport_bottom) ||
           (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
  }
})(jQuery);

// We are adding some new methods to localStorage object. These methods allow data
// to be easily serialized to and from localStorage.
//https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

if (!window.localStorage.getObject('seen_tweets')) {
    console.log('Setting empty seen tweets')
    window.localStorage.setObject('seen_tweets',new Array())
}

function addTweetID(tweet_ID,window) {

    var seen_tweets = window.localStorage.getObject('seen_tweets');

    if (!(seen_tweets.includes(tweet_ID))) {
        seen_tweets.push(tweet_ID)
    }


    window.localStorage.setObject('seen_tweets',seen_tweets)
    console.log(seen_tweets);
    // window.localStorage['seen_tweets'].add(tweet_ID)
}

function checkTweets(window) {
    console.log('checking tweets')
    var tweets = $(".tweet")
    var seen_tweets = window.localStorage.getObject('seen_tweets');

    for (i=0;i<tweets.length;i++) {
        var tweet_ID = tweets[i].getAttribute('data-tweet-id')
        if (seen_tweets.includes(tweet_ID)) {
            $('[data-tweet-id=' + tweet_ID + ']').css('background','#ddf6dd')
        }
    }
}

function recordTweets() {
    var tweets = $(".tweet:onScreen")
    console.log('recording tweets')
    for (i=0;i<tweets.length;i++) {
        var tweet_ID = tweets[i].getAttribute('data-tweet-id')
        $('[data-tweet-id=' + tweet_ID + ']').css('background','#ddf6dd')
        addTweetID(tweet_ID,window)
    }
}


checkTweets(window)

jQuery(document).ready(function() {
    console.log('here now', window.location.href)

    if (window.location.href.startsWith("https://twitter.com/")) {
        console.log("We are live on Twitter.com and it is loading.");
        $(function() {
          setInterval(recordTweets, 5000) // repeat every fives seconds
        })
    }
})
