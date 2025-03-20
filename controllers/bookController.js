const bookModel = require("../model/book");


const createBook = async function (req, res) {

    const create = await bookModel.create({
        userId: req.id,
        book_name: req.body.name,
        book_type: req.body.type,
        description: req.body.description,
    })
    create.save();
    if (create) {
        res.send("Book created successfully")
    } else {
        res.send("Book does not create")
    }

}

const getBook = async function (req, res) {
    try {
        const book = await bookModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    book_name: 1,
                    book_type: 1,
                    description: 1,
                    "userDetails.name": 1,
                    "userDetails.email": 1,
                    "userDetails.phone": 1
                }
            }
        ])
        res.json(book);
    } catch (err) {
        console.log(err);

    }
}


module.exports = { createBook, getBook }


;
