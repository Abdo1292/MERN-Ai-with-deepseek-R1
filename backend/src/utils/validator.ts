import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

const validate = (validations: ValidationChain[]) => {

 return async (
  req: Request, 
  res: Response, 
  next: NextFunction
 ) => {
    for( let validation of validations){
        const result = await validation.run(req)
        if(!result.isEmpty()){
          break;
        }
    }
    const errors = validationResult(req);
    if(errors.isEmpty()){
      return next();
    }
    return res.status(422).json({ errors: errors.array() })
    
 }
}

const signUpValidator = [
    body("name").notEmpty().withMessage('name is required'),
    body("email").trim().isEmail().withMessage('email is required'),
    body("password")
    .trim().
    isLength({min: 6})
    .withMessage('password should be at least 6 characters ')
]

const loginValidator = [
  body("email").trim().isEmail().withMessage('email is required'),
  body("password")
  .trim().
  isLength({min: 6})
  .withMessage('password should be at least 6 characters ')
]

const chatCompletionValidator = [
  body("message").notEmpty().withMessage('a message is required'),
]

export {signUpValidator, chatCompletionValidator, loginValidator, validate};