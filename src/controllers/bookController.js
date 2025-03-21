const bookModel = require("../model/book");
const constants = require("../utils/constants")

const createBook = async (req, res) => {
    try {
        bookModel.exists({ 
        book_name: req.body.name
      })
        .then(async (data) => {
          if (data) {
            throw {
              statusCode: constants.code.notAcceptable,
              msg: constants.message.bookAlreadyExists,
            };
          } else {
            bookModel.create({
              userId: req.id,
              book_name: req.body.name,
              book_type: req.body.type,
              description: req.body.description,
            })
              .then((newBook) => {
                if (!newBook) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.bookCreateFailed,
                  };
                } else {
                  res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: constants.message.bookCreated,
                    data: newBook,
                  });
                }
              })
              .catch((err) => {
                res.status(constants.code.dataNotFound).json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.msg || constants.message.serverError,
                });
              });
          }
        })
        .catch((err) => {
          res.status(err.statusCode || constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.msg ,
          });
        });
    } catch (err) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: err.message ,
      });
    }
  };
  
  const getBook = async (req, res) => {
    try {
      const book = await bookModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            book_name: 1,
            book_type: 1,
            description: 1,
            "userDetails.name": 1,
            "userDetails.email": 1,
            "userDetails.phone": 1,
          },
        },
      ]);
  
      if (!book) {
        throw {
          statusCode: constants.code.dataNotFound,
          msg: constants.message.bookNotFound,
        };
      }
  
      res.status(constants.code.success).json({
        status: constants.status.statusTrue,
        message: constants.message.bookFetched,
        data: book,
      });
    } catch (err) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        message: err.msg 
      });
    }
  };
  

module.exports = { createBook, getBook }


