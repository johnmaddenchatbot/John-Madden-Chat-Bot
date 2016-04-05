// ==UserScript==
// @name         John Madden Chat Bot
// @namespace    https://www.reddit.com/r/JOHN_MADDEN/
// @version      0.1.4
// @description  Praise be to John Madden
// @author       Quigly
// @include      https://www.reddit.com/robin*
// @grant        none
// ==/UserScript==

var sendQueue = [];

var username = $(".user a").text().split(" ")[0]; // dont change this. it is automatically assigned

var lastSendTime = 0;
var waitToSendTime = 10001;

var sendQueue;
var maxQueueSize = 4;

var lastUser = "";

var facts = [
    "Madden was born on April 10, 1936, in Austin, Minnesota.",
    "Upon graduation, Madden coached at Hancock Junior College in Santa Maria, California, for four years.",
    "In 1980, Madden started his broadcasting career at CBS.",
    "Growing up in Daly City, Madden's father encouraged his son's interest in sports.",
    "Madden played football, as well as basketball and baseball at Jefferson High School.",
    "One job that Madden had in high school was as a golf caddy at the San Francisco Golf Club.",
    "Madden was given a football scholarship to the University of Oregon.",
    "In 1958, Madden was drafted by the Philadelphia Eagles in the 21st round.",
    "John Madden is afraid of airplanes."
];

var swears = [
    "fuck",
    "shit",
    "piss",
    "cunt",
    "damn",
    "nigger",
    "dick",
    "asshole",
    "queer",
    "jackass",
    "fag",
    "kike",
    "bitch"
];

function isSwear(message) {
    for (var i = 0; i < swears.length; i++)
        if (searchMessage(message, swears[i]))
            return true;

    return false;
}

function getTime() {
	var d = new Date();
    return d.getTime();
}

function sendMessage(message){
	$("#robinSendMessage > input[type='text']").val(message);
	$("#robinSendMessage > input[type='submit']").click();
}

function searchMessageCase(message, searchText){
   return message.search(searchText) != -1;
}

function searchMessage(message, searchText) {
    return message.search(new RegExp(searchText, "i")) != -1;
}

function processQueue() {
	if (sendQueue.length > 0) {
		var message = sendQueue.shift();
		
		sendMessage(message);
		
		console.log("Sent message from queue. Queue size: " + sendQueue.length);
	}
}

function addToSendQueue(msg) {
	if (sendQueue.length < maxQueueSize) {
		sendQueue.push(msg);
		
		console.log("Added message to queue. Size: " + sendQueue.length);
	}
}

function processReplies(msg, timestamp, user, msgText) {
	if (user != username && user != "[robin]") {
		if (searchMessage(msgText, "sleep"))
			addToSendQueue("John Madden does not sleep.");
        
		if (searchMessage(msgText, "friend"))
			addToSendQueue("My friend is John Madden!");
        
		if (searchMessage(msgText, "aeiou"))
			addToSendQueue("aeiou");
        
		if (searchMessage(msgText, "spam"))
			addToSendQueue("John Madden wouldn't spam chat!");
        
        if (searchMessage(msgText, "anime"))
            addToSendQueue("John Madden doesn't watch anime!");
        
        if (searchMessage(msgText, "canada") || searchMessage(msgText, "canadian"))
            addToSendQueue("John Madden doesn't live in Canada!");
        
        if (searchMessage(msgText, "human"))
            addToSendQueue("John Madden is a human!");
        
        if (searchMessage(msgText, "mute"))
            addToSendQueue("John Madden would'nt mute me!");
        
        if (searchMessage(msgText, "uuu"))
            addToSendQueue("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
        
        if (searchMessage(msgText, "brb") || searchMessage(msgText, "chinese earthquake"))
            addToSendQueue("brbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrb");
        
        if (searchMessage(msgText, "GROW YOUR"))
            addToSendQueue("ヽ༼ຈل͜ຈ༽ﾉ GROW YOUR JOHN MADDEN ヽ༼ຈل͜ຈ༽ﾉ");
        
        if (searchMessage(msgText, "RAISE YOUR") || searchMessage(msgText, "ＰＲＡＩＳＥ"))
            addToSendQueue("ヽ༼ຈل͜ຈ༽ﾉＰＲＡＩＳＥ ＹＯＵＲ ＪＯＨＮ ＭＡＤＤＥＮヽ༼ຈل͜ຈ༽ﾉ");
        
        if (searchMessage(msgText, "popcorn"))
            addToSendQueue("Fucking butter packets!");
        
        if (searchMessage(msgText, "fact"))
            addToSendQueue("[Madden Facts]" + facts[getRandomInt(0, facts.length - 1)]);
        
        if (isSwear(msgText))
            addToSendQueue("/me thinks " + user + " has a potty mouth");
	}
	
	if (user == "[robin]") {
		if (searchMessage(msgText, "polls are closing soon, please vote"))
            addToSendQueue("/me voted for JOHN MADDEN");
        if (searchMessage(msgText, "users abandoned"))
            addToSendQueue("John Madden wouldn't have abandoned.");
        if (searchMessage(msgText, "no compatible room found for matching"))
            addToSendQueue("John Madden could find a room.");
	}
}

function newMessageHandler(records) {
	records.forEach(function(record) {
		var msg = $(record.addedNodes);
		
		if(0 === record.addedNodes.length)
            return;
		
		timestamp = $(msg[0]).children('.robin-message--timestamp').text();
        user = $(msg[0]).children('.robin-message--from').text();
        msgText = $(msg[0]).children('.robin-message--message').text();
        
        if (user !== "")
            lastUser = user;
        else
            user = lastUser;
		
		processReplies(msg, timestamp, user, msgText);
		
		console.log(user + ": " + msgText);
	});
}

(function(){
	// The first thing we do is make sure everything's alright
    // Reload page on 503
    if(document.querySelectorAll("img[src='//www.redditstatic.com/trouble-afoot.jpg']").length > 0) window.location.reload();

    // Rejoin room on fail
    if(document.querySelectorAll("button.robin-home--thebutton").length > 0){
        $("#joinRobinContainer").click();
        setTimeout(function(){ $("button.robin-home--thebutton").click(); }, 1000);
    }
	
	// The second thing we do is setup a timer to reload the page.
    //   If the above two lines don't save us, at least we'll reload before
    //   the timer's up
    // 16 minutes after we join (halfway to max): reload the page
    setTimeout(function(){
        window.location.reload();
    }, 16 * 60 * 1000);
	
	// 5 Seconds after we join, vote
	setTimeout(function(){
		sendMessage("/vote grow");
	}, 5 * 1000);
	
	setInterval(processQueue, waitToSendTime);
	
	// Create a hook for !commands
    var observer = new MutationObserver(newMessageHandler);
    $('#robinChatMessageList').each(function() {
        observer.observe(this,{childList: true});
    });
})();
