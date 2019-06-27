const mongoose = require('mongoose');

/*
{
  "question": "I'm an actual genius when it comes to this game.",
  "isKyrie": true,
  "author": "Kyrie Irving",
  "source": "http://www.espn.com/q/rt1342/kyrie-irving-a-bitch",
  "image": "http://www.aws.s3/didkyriesayitimage",
}
*/

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    isKyrie: Boolean,
    author: {
      type: String,
      required:true
    },
    source: {
      type: String,
      required: true
    },
    image:String,
    responses: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Response'
    }]
  }
)

const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:'Question'
  },
  questionRespondedCorrectly: Boolean,
  questionDifficulty: Number
})

module.exports = {
  question: mongoose.model('Question',questionSchema),
  response: mongoose.model('Response',responseSchema)
}
