// Instantiate global variables
var quotes;
var activeQuote;
var activeQuestionIdx = 0;
var activeRating = 0;
var incorrectCount = 0;
var correctCount = 0;
var answeredCorrectly;

var redditRegex = /reddit/g;

// Request Quotes
$.get("/api/quotes", function (data, status){
  quotes = data.quotes;

  for (var i = 0; i < quotes.length; i++ ){
    var quote = quotes[i];
    
    $('.quoteList').append(
      `<div class='quote'>
         <div class='quote-text'>"${quote.question}"</div>
        </div>`
    )
  }
})
.fail(function (xhr, textStatus, errorThrown) {
  console.log('Ajax error', textStatus, errorThrown);
});

/*****  Helper Functions  *******/

var getAnswerStats = questionId => {
  return $.get(`/api/quotes/answerStats/${questionId}`,function(data,status){});
}

var determineEmoji = score => {
    var o = {
      'emoji':'',
      'text':''
    };
    
    if (score === 100){
      o.emoji = '😎'
      o.text = '👂👁W O K E A F 👁👂'
      return o;
    }
    
    else if (score > 90){
      o.emoji = '😀'
      o.text = "real recognize real, you looking real familiar"
      return o;
    }
    
    else if (score > 80){
      o.emoji = '🙂'
      o.text = "i mean you're not woke but, like, i'd still go on a date with you i guess"
      return o;
    }
    
    else if (score > 70){
      o.emoji = '😕'
      o.text = "You gotta find your inner chakra bro....try again"
      return o;
    }
    
    else if (score > 60){
      o.emoji = '😟'
      o.text = "I mean, I guess you're trying?"
      return o;
    }
    
    else if (score > 50){
      o.emoji = '😣'
      o.text = `I think the disappointment is palpable, but it could always be better?`
      return o;
    }
    
    else if (score > 40){
      o.emoji = '😖'
      o.text = "nephew, this ain't it"
      return o;
    }
    
    else if (score > 30){
      o.emoji = '😫'
      o.text = "i don't even think you're worthy of nephew, not going to lie."
      return o;
    }
    
    else if (score > 20){
      o.emoji = '😩'
      o.text = "i bet you only sort by hot"
      return o;
    }
    
    else if (score > 10){
      o.emoji = '🤢'
      o.text = `do you walk around in life telling people "just fade me?"`
      return o;
    }
    
    else if (score > 0){
      o.emoji = '😴'
      o.text = "NOT WOKE wake TF UP you sheep!"
      return o;
    }
}

var submitAnswer = () => {

  var data = {
    questionId: activeQuote._id,
    questionDifficulty: activeRating,
    questionRespondedCorrectly:answeredCorrectly
  };

  $.post('/api/quotes/answer', data);

  answeredCorrectly='';
  activeRating = 0;
}

var changeRating = (rating) => {
  switch(rating) {
    case "easy":
      activeRating = 1;
      break;
    case "medium":
      activeRating = 2;
      break;
    case "hard":
      activeRating = 3;
      break;
    default:
  }

}

var changeProgressNumber = () => {
  $('.progress').text(`${activeQuestionIdx+1}/${quotes.length}`)
}

var answerQuestion = (quoteData) => {
  var output;
  
  if (quoteData.isKyrie){
    output = {
      _id: quoteData._id,
      isKyrie:true,
      source: quoteData.source,
    }
  }
  else if (!quoteData.isKyrie){
    output = {
      _id: quoteData._id,
      isKyrie: false,
      source: quoteData.source,
      image: quoteData.image,
      author: quoteData.author
    }
  }
  return output;
}

var btnAnswer = async bool => {
  $('.btn-answer').hide();
  $('.lds-default div').show()


  var isYes = bool === 'yes' ? true : false;
  var questionAnswered = answerQuestion(activeQuote);
  var answerStats = await getAnswerStats(questionAnswered._id);

  var percentage = answerStats.data ? answerStats.data : 0;
  if (percentage){
    $(".answerStats").text(`${percentage}% of other people got this correct.`).show();
  }

  if (activeQuestionIdx === quotes.length - 1) $('.btn-next').text('Finish! 💪')
  
  if (questionAnswered.isKyrie){
    answeredCorrectly = isYes ? true : false;

    if (answeredCorrectly){
      correctCount++;
      $(".answer-text").text("CORRECT - HE DID.");
      $('.answer-text').addClass('answer-correct');
      $('.answer-results').append(`
        <img class='answer-result-image' src='./public/img/Success.png' alt=''/>
      `)

      $(".response-image").attr('src','https://didkyriesayit.s3.us-east-2.amazonaws.com/Kyrie+Thumbs+Up.jpg');
      $('.question-source-link').attr('href',questionAnswered.source);
      $('.questionContainer').fadeOut('fast',function(){
        $('.lds-default div').hide();
        $('.btn-answer').show();
        $('.btn-answer').attr('disabled', false);
        $(".resultContainer").fadeIn('fast');
      })
    }

    else {
      incorrectCount++;
      $(".answer-text").text("INCORRECT - HE DID.");
      $('.answer-text').addClass('answer-incorrect');
      $('.answer-results').append(`
        <img class='answer-result-image' src='./public/img/Fail.png' alt=''/>
      `)
      $(".response-image").attr('src','https://didkyriesayit.s3.us-east-2.amazonaws.com/Kyrie+Thumbs+Up.jpg');
      
      $('.question-source-link').attr('href',questionAnswered.source);
    
      $('.questionContainer').fadeOut('fast',function(){
        $('.lds-default div').hide();
        $('.btn-answer').show();
        $('.btn-answer').attr('disabled', false);
        $(".resultContainer").fadeIn('fast');
      })
    }
  }

  else if (!questionAnswered.isKyrie) {
    answeredCorrectly = !isYes ? true : false;
    let fromReddit = redditRegex.test(questionAnswered.source);

    if (answeredCorrectly){
      correctCount++;
      if (fromReddit){
        $('.response-image').hide();
        $('.actual-author').addClass('huge');
      }
      else {
        $(".response-image").attr('src',questionAnswered.image);  
      }
      $('.answer-results').append(`
        <img class='answer-result-image' src='./public/img/Success.png' alt=''/>
      `)
      $(".answer-text").text("CORRECT - HE DIDN'T.");
      $('.answer-text').addClass('answer-correct');
      $(".actual-author").text(questionAnswered.author).show();
      
      $('.question-source-link').attr('href',questionAnswered.source);

      $('.questionContainer').fadeOut('fast',function(){
        $('.lds-default div').hide();
        $('.btn-answer').show();
        $('.btn-answer').attr('disabled', false);
        $(".resultContainer").fadeIn('fast');
      })
    }

    else {
      incorrectCount++;
      if (fromReddit){
        $('.response-image').hide();
        $('.actual-author').addClass('huge');
      }
      else {
        $(".response-image").attr('src',questionAnswered.image);  
      }
      $('.answer-results').append(`
        <img class='answer-result-image' src='./public/img/Fail.png' alt=''/>
      `)
      $(".answer-text").text("INCORRECT - HE DIDN'T.");
      $('.answer-text').addClass('answer-incorrect');
      $(".response-image").attr('src',questionAnswered.image);
      $(".actual-author").text(questionAnswered.author).show();
      $('.question-source-link').attr('href',questionAnswered.source);

      $('.questionContainer').fadeOut('fast',function(){
        $('.lds-default div').hide();
        $('.btn-answer').show();
        $('.btn-answer').attr('disabled', false);
        $(".resultContainer").fadeIn('fast');
      })
    }
  }
};

/*****  Click-Handers  *******/

// Next Question
$('.btn-next').click((e) => {
  e.preventDefault();
  $('.btn-next').attr('disabled', true);

  var quoteLen = quotes.length;
  let quoteDivs = $('.quoteList').children();

  $(quoteDivs[activeQuestionIdx]).removeClass('active');
  activeQuestionIdx++;
  activeQuote = quotes[activeQuestionIdx];

  if (activeQuestionIdx < quoteLen) {
    submitAnswer()
    changeProgressNumber();
    $('.resultContainer').fadeOut('fast',function(){
      $('.btn-next').attr('disabled', false);
      $(".answer-text").text('');
      $(".answerStats").hide();
      $('.actual-author').removeClass('huge');
      $('.btn-rate').removeClass('btn-rate-selected');
      $(".actual-author").text('').hide();
      $('.answer-text').removeClass('answer-correct answer-incorrect');
      $('.questionContainer').fadeIn('fast');
      $('.response-image').show();
    })

    $(quoteDivs[activeQuestionIdx]).addClass('active');
  } else {
    var scoreOutcome;
    var scorePercentage = Math.floor(correctCount/quotes.length*100);
    scoreOutcome = determineEmoji(scorePercentage);

    $('.resultContainer').fadeOut('fast',function(){
      // var twitterURL = `https://twitter.com/intent/tweet?url=http://www.didkyriesayit.com&via=mansquiet&text=I%20scored%20${correctCount}/${quotes.length}%20on%20"Did%20Kyrie%20Say%20It?"`
      var fbURL = `https://www.facebook.com/sharer/sharer.php?u=http://www.didkyriesayit.com&t=I%20scored%20${correctCount}/${quotes.length}%20on%20"Did%20Kyrie%20Say%20It?`
      // $('.btn-twitter').attr('href',twitterURL);
      $('.btn-facebook').attr('href',fbURL).click(e=>{
        window.open(fbURL, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
      });

      $(".score").text(`${correctCount}/${quotes.length}`);
      $('.finalResults-emoji').text(scoreOutcome.emoji);
      $('.finalResults-text').text(scoreOutcome.text);
      $('.finalResults-container').fadeIn('fast');
    })
  }
});

// Select Rating
$('.btn-rate').click((e)=>{
  e.preventDefault();

  $('.btn-rate').removeClass('btn-rate-selected');

  var rating = e.target.innerHTML.toLowerCase();
  e.target.classList.add('btn-rate-selected');
  changeRating(rating);
})


// Start Quiz
$('.startQuiz').click(function(e){
  e.preventDefault();
  changeProgressNumber()

  $('.intro').fadeOut('fast',function(){
    $('.responses').fadeIn('fast');
  });
  
  let quoteDivs = $('.quoteList').children();
  
  $(quoteDivs[activeQuestionIdx]).addClass('active');
  activeQuote = quotes[activeQuestionIdx];
})

// Select Yes
$('.btn-yes').click(function(e){
  e.preventDefault();
  $('.btn-answer').attr('disabled', true);
  btnAnswer('yes');
})

// Select No
$('.btn-no').click(function(e){
  e.preventDefault();
  $('.btn-answer').attr('disabled', true);
  btnAnswer('no')
})
