const mongoose = require('mongoose')
const cities = require('./cities');
const { places, descriptors } = require('./seedhelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6258d1a4909df09d6541a949',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            img: [
                {
                    url: 'https://res.cloudinary.com/dpnzfm9xp/image/upload/v1650582534/YelpCamp/udil7ljuq9xg9g59keey.jpg',
                    filename: 'YelpCamp/udil7ljuq9xg9g59keey',
                },
            {
                    url: 'https://res.cloudinary.com/dpnzfm9xp/image/upload/v1650582534/YelpCamp/seawzodg2babys7mcun9.jpg',
                    filename: 'YelpCamp/seawzodg2babys7mcun9'
            }

            ],
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora quaerat ex, eligendi ad quam porro natus, architecto dolore quibusdam pariatur voluptas, veniam quisquam dicta. Ex accusamus nesciunt optio quae possimus!',
            price,
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})