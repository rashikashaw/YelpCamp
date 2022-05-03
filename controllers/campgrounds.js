const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const {cloudinary} = require('../cloudinary');
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken})



module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds}  );
}

module.exports.renderNewForm = (req, res)=>{
    res.render('campgrounds/new');
};

module.exports.createCampgrounds = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.img = req.files.map(f => ({url: f.path, filename:f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground){
        req.flash('error', "Cannot find that campground!")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
};

module.exports.renderEditForm = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', "Cannot find that campground!")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.updateCampgrounds = async(req, res)=>{
    const { id }  = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename}));
    campground.img.push(...imgs);
    await campground.save();
    if (req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {img: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('succes', "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampgrounds = async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted campground")
    res.redirect('/campgrounds')
};