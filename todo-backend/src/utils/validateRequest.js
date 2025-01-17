import { FILTER_KEYS } from "../constants.js";
/**
 * @description : validate request body parameter with joi.
 * @param {Object} payload : body from request.
 * @param {Object} schemaKeys : model wise schema keys. ex. user validation.
 * @returns : returns validation with message {isValid, message}
 */
export const validateParamsWithJoi = (payload , schemaKeys) => {
    console.log("payload",payload)
    const {error} = schemaKeys.validate(payload)
    console.log("error",error)
    if(error){
        const message = error.details.map((el) => el.message).join('\n');
        return {
            isValid : false,
            message,
        }
    }
    return {isValid :true}
}

export const validateFilterWithJoi = (payload, schemaKeys, modelSchema) => {
    const keys = []; 
    let isValid = true;
    // console.log(payload, schemaKeys, modelSchema)
    if (modelSchema) {
      keys.push(...Object.keys(modelSchema), ...Object.values(FILTER_KEYS));
      if (payload.options && payload.options.select) {
        if (Array.isArray(payload.options.select)) {
          isValid = keys.some((ai) => payload.options.select.includes(ai));
        } else if (typeof payload.options.select === 'string') {
          payload.options.select = payload.options.select.split(' ');
          isValid = keys.some((ai) => payload.options.select.includes(ai));
        } else {
          isValid = keys.some((ai) => Object.keys(payload.options.select).includes(ai));
        }
      } else if (payload && payload.select) {
        if (Array.isArray(payload.select)) {
          isValid = keys.some((ai) => payload.select.includes(ai));
        } else if (typeof payload.select === 'string') {
          payload.select = payload.select.split(' ');
          isValid = keys.some((ai) => payload.select.includes(ai));
        } else {
          isValid = keys.some((ai) => Object.keys(payload.select).includes(ai));
        }
      }
      if (!isValid) {
        return {
          isValid: false,
          message: 'invalid attributes in options.select',
        };
      }
    }
    const { error } = schemaKeys.validate(payload, {
      abortEarly: false,
      convert: false,
    });
    if (error) {
      const message = error.details.map((el) => el.message).join('\n');
      return {
        isValid: false,
        message,
      };
    }
    return { isValid: true };
  };
  
 
  