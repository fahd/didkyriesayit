const express = require('express')
const { Router } = express;
const controllers = require('./quote.controller.js')
const { 
  question, 
  // response 
} = controllers;
const router = Router();



router
.route('/')
.get(question.getMany)
.post(question.createOne)

module.exports = router;