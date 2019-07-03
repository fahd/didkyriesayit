const _ = require('lodash');

const createOne = model => async (req,res) => {
  try {
    const doc = await model.create({
      ...req.body
    });
    return res.status(201).json({data:doc})
  } catch (e){
      console.error('error',e);
      return res.status(400).end()
  }
}

const getResponses = (Question, Response) => async (req,res) => {
  const { questionId } = req.body;
  const responses = await Response.find({
    question:questionId
  })
  .lean()
  .exec()

  return res.status(201).json({data:responses})
}

const createResponse = (Question, Response) => async (req,res) => {
  const {questionId, questionRespondedCorrectly, questionDifficulty} = req.body;

  try {
    const quote = await Question.findOne({
      _id: questionId
    });

    quote.save(error => {
      if (error) {
        console.log('error',error);
      }

      var response = new Response({
        question:questionId,
        questionRespondedCorrectly, 
        questionDifficulty
      });
  
      response.save(err => {
        if (err){
          console.log('err', err);
        }
      });
    });

    return res.json({data:quote})

  } catch (e){
      console.error('error creating response',e);
      res.status(400).end()
  }
}

const getResponseStats = Response => async (req,res) => {

  const correctCount = await Response
  .find({
    question: req.params.id,
    questionRespondedCorrectly:true
  })
  .count()
  .lean()
  .exec()
  

  const count = await Response
  .find({
    question: req.params.id,
  })
  .count()
  .lean()
  .exec()

  return res.status(201).send({data:Math.floor(correctCount/count*100)});
}

const getMany = model => async (req,res) => {
  const amountTrue = Math.max(6, Math.ceil(Math.random() * 7);
  const amountFalse = 14 - amountTrue;

  try {
    // const quotesByKyrieCount = await model
    // .count({isKyrie:true})

    let quotesByKyrie = await model
      .find({
        isKyrie:true
      })
      .lean()
      .exec()
    
    quotesByKyrie = _.shuffle(quotesByKyrie).slice(0,amountTrue);
    
    let notQuotesByKyrie = await model
      .find({
        isKyrie:false
      })
      .lean()
      .exec()
    
    notQuotesByKyrie = _.shuffle(notQuotesByKyrie).slice(0,amountFalse)

    const quotes = _.shuffle([...quotesByKyrie, ...notQuotesByKyrie])
    
    return res.status(200).json({quotes, len:quotes.length});

  } catch (e){
    console.error('getting many', e);
    return res.status(400).end();
  }
}

const getOne = model => async (req,res) => {

  try {
    const doc = await model
    .findOne({createdBy: req.user._id, _id: req.params.id})
    .lean()
    .exec()

    return res.status(200).json({data:doc})

  } catch (e){
    console.error('error in get one', e);
    return res.status(400).end();
  }
}

const crudControllers = (model1,model2) => ({
  createOne: createOne(model1),
  createResponse: createResponse(model1,model2),
  getResponses: getResponses(model1,model2),
  getResponseStats: getResponseStats(model2),
  getOne: getOne(model1),
  getMany: getMany(model1)
})

module.exports = crudControllers;