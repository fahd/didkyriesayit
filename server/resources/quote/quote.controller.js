const crudControllers = require('../../utils/crud');
const QuoteSchemas = require('./quote.model');
const Question = QuoteSchemas.question;
const Response = QuoteSchemas.response;

module.exports = {
  question: crudControllers(Question),
  response: crudControllers(Response)
}