// Messages
const message = {
    dbConnect: "MONGODB::Connected to database.",
    clConnect: "MONGODB::Connected to cluster.",
    retry: "Kindly Re-try After 10 Seconds",
    success:"success",
    failed: "failed",
    dataNotFound: "Data not found.",
    internalServerError: "Internal server error. Please try after some time.",
    unAuthAccess: "Unauthorized access.",
    unwantedData: "Unwanted data found.",
    invalidEmail: "Invalid email address.",
    invalidEmailAddress: "You can not update email of primary address",
    invalidPhone: "Invalid phone number.",
    invalidAuthToken: "Invalid authentication token.",
    invalidVerifyToken: "Invalid verification token.",
    invalidUPI: "Invalid UPI ID",
    tokenExpire:
      "The token has expired. Please re-send the verification token to try again.",
    tokenSuccess: "Token verified successfully.",
    reqAccessToken: "Access Token is required.",
    invalidAccessToken: "Invalid Access Token.",
    emailTaken: "Email is already taken.",
    phoneTaken: "Phone number is already taken.",
    invalidPinCode: "Not a valid pincode.",
    invalidPSW: "Invalid password.",
    pswNotMatched: "The password confirmation does not match.",
    invalidValue: "Invalid value.",
    userSuccess: "Registered successfully.",
    invalidPassword: "Invalid password.",
    userInactive: "Your account is disabled.",
    userDeleted: "Your account is suspended.",
    invalidUser: "You are not a valid user.",
    userLogin: "User logged in successfully.",
    userDetail: "User details get successfully.",
    userUpdate: "User details updated successfully.",
    userDisable: "Your Account deactivated successfully.",
    userRemove: "Your Account deleted successfully.",
    logout: "Logout successfully.",
    logoutAll: "Logout from all devices successfully.",
    addressExist: "Address already exist.",
    invalidFileType: "Invalid file type.",
    recordNotFound: "No records found.",
    badRequest: "Couldn't parse the specified URI.",
    bookAlreadyExists:"Book already exists"
   
  };
  
  // Response Status
  const status = {
    statusTrue: true,
    statusFalse: false,
  };
  
  // Response Code
  const code = {
    success: 200,
    FRBDN: 403,
    dataNotFound: 404,
    badRequest: 400,
    reqTimeOut: 408,
    unAuthorized: 401,
    PaymentRequired: 402,
    badMethod: 405,
    notAcceptable: 406,
    preconditionFailed: 412,
    unprocessableEntity: 422,
    tooManyRequests: 429,
    internalServerError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeOut: 504,
    expectationFailed: 417,
  };
  
 
  
  
  module.exports = {
    message,
    status,
    code
  };
  