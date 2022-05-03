const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const review = require('./review');
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url: String,
    filename: String,
    
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const opts= { toJSON: {virtuals: true} };

const CampGroundSchema = new Schema({
    title: String,
    img: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectID, 
            ref: "Review",
        }
    ]
}, opts);

CampGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}></a></strong>
    <p>${this.description}</p>`
});

CampGroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
}, opts)
module.exports = mongoose.model('Campground', CampGroundSchema);


