module.exports = function(app) {

    var twitter = require('./controllers/twitterController');

    app.get('/', function(req, res, next){
        return res.send("QikDispatch Tweets");
    });

    // PATIENT COLLECTION
    // Get Latest Tweets
    app.get('/get_mention_tweets', twitter.getMentionTweets);
    
};