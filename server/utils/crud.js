const createOne = model => async (req,res) => {
  try {
    const doc = await model.create({
      ...req.body
    });
    res.status(201).json({data:doc})
  } catch (e){
      console.error('error',e);
      res.status(400).end()
  }
}

const getMany = model => async (req,res) => {
  const amountTrue = Math.max(4, Math.ceil(Math.random() * 6));
  const amountFalse = 10 - amountTrue;

  try {
    // const quotesByKyrieCount = await model
    // .count({isKyrie:true})

    const randomTrueCount = Math.floor(Math.random() * amountTrue);
    const randomFalseCount = Math.floor(Math.random() * amountFalse);

    const quotesByKyrie = await model
      .find({
        isKyrie:true
      })
      .skip(randomTrueCount)
      .limit(amountTrue)
      .lean()
      .exec()
    
    const notQuotesByKyrie = await model
      .find({
        isKyrie:false
      })
      .skip(randomFalseCount)
      .limit(amountFalse)
      .lean()
      .exec()
    
      res.status(200).json({
        trueQuotes: quotesByKyrie,
        falseQuotes: notQuotesByKyrie,
      });

  } catch (e){
    console.error('getting many', e);
    res.status(400).end();
  }
}

const getOne = model => async (req,res) => {

  try {
    const doc = await model
    .findOne({createdBy: req.user._id, _id: req.params.id})
    .lean()
    .exec()

    res.status(200).json({data:doc})

  } catch (e){
    console.error('error in get one', e);
    res.status(400).end();
  }
}

const crudControllers = model => ({
  createOne: createOne(model),
  getOne: getOne(model),
  getMany: getMany(model)
})

module.exports = crudControllers;