const mongoose = require('mongoose');

const placesSchema = mongoose.Schema({
    name: String,
    icon: String,
    address_components: {
	    number: Number,
	    street: String,
    	city: String,
	    state: String,
    	zip_code: Number,
	    country: String
    },
    business_status: String,
    phone_number: String,
    hours: {},
    geometry: {},
    place_id: String,
    price_level: Number,
    rating: Number,
    website: String,
    popular_times: {
        sun: {},
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
    },
    photo: String,
})

const Places = mongoose.model('Places', placesSchema);

module.exports = Places;