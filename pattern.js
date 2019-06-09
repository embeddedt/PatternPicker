

var pattern = [];

var choosingElement = 0;

var level = 1;

var delay = 500;

var shown = false;

var questionsAnswered;
var currentTimeout;

function sortNumber(a, b) {
  return a - b;
}

function displayPattern(callback) {
    var patternIdx = 0;
    shown = false;
    clearTimeout(currentTimeout);
    var patternFunc = function() {
        if(shown) {
            shown = false;
            showPattern(-2);
        } else if(patternIdx === pattern.length) {
            showPattern(-1);
            if(callback !== undefined)
                callback();
            return;
        } else {
            showPattern(pattern[patternIdx]);
            patternIdx++;
            shown = true;
        }
        currentTimeout = setTimeout(patternFunc, delay);
    };
    patternFunc();
}

function generatePattern() {
    pattern = [];
    pattern[0] = getRandomInt(0, 2);
    
    choosingElement = 0;
    if(level < 4)
        $("#the-text").text("Which item comes next?");
    else
        $("#the-text").text("Which item comes next?");
    if(level >= 1 && level <= 3) {
        pattern[1] = getRandomInt(0, 2, [pattern[0]]);
        if(level === 1)
            return;
    }
    if(level === 2 || level === 3) {
        pattern[2] = getRandomInt(0, 2, [pattern[0], pattern[1]]);
        if(level === 2)
            return;
        pattern[3] = getRandomInt(0, 2);
        console.log(pattern[3]);
        return;
    }
    
    if(level >= 4) {
        for(var i = 0; i < getRandomInt(3, 5); i++) {
            pattern[i] = getRandomInt(0, 2);
        }
        return;
    }
    
    throw "Unhandled level";
}

function getRandomInt(min, max, skipIntegers) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var i;
    do {
        i = Math.floor(Math.random() * (max - min + 1)) + min;
    } while(skipIntegers !== undefined && skipIntegers.indexOf(i) !== -1);
    return i;
}

function showPattern(i) {
    $(".item-in-pattern").hide();
    $("#question-mark").hide();
    if(i >= 0)
        $($(".item-in-pattern")[i]).show();
    else if(i === -1)
        $("#question-mark").show();
    else
        $("#blank-item").show();
}
$(window).load(function() {
    $(".item-button").not("#replay-button").not("#next-button").click(function() {
        var index = $(".item-buttons").children().index(this);
        if(index === -1)
            return;
        console.log("Button " + index);
        if(pattern[choosingElement] === index) {
            if(level < 5 || choosingElement === 1) {
                $(".item-button").not("#replay-button").not("#next-button").prop("disabled", true);
                $("#the-text").text("Correct!");
            } else {
                $("#the-text").text("Right! What's the item after that?");
                choosingElement++;
                return;
            }
            
            questionsAnswered++;
            if(questionsAnswered === 10) {
                $("#the-text").text("Awesome! Let's try a different level!");
            }
            $("#next-button").removeProp("disabled");
        } else {
            $("#the-text").text("Nope. Replay the pattern if you're not sure.");
        }
    });
    $("#next-button").click(function() {
        if(questionsAnswered === 10) {
            $("#level-selector").show();
            $("#application").hide();
            $("#go-button").removeProp("disabled");
            return;
        }
        generatePattern();
        console.log(pattern);
        $(".item-button").not("#replay-button").not("#next-button").prop("disabled", true);
        displayPattern(function() {
            $(".item-button").not("#replay-button").not("#next-button").removeProp("disabled");
        });
        
    });
    $("#application").hide();
    $("#go-button").click(function() {
        level = parseInt($("input[name=level]:checked").val());
        if(isNaN(level) || level === undefined)
            return;
        questionsAnswered = 0;
        $("#level-selector").hide();
        $("#application").show();
        $("#next-button").prop("disabled", true);
        $("#next-button").click();
    });
    showPattern(0);
    
});