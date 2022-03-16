const Places = require('../models/placesModel');
const { fillHours } = require('./popularTimesGenerator');
const axios = require('axios');
const User = require('../models/userModel');

const viewPlace = (req, res, next) => {
    const { query } = req.body;
    const search = query.replace(/ /g, '+');

    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${process.env.GOOGLE_API_KEY}`)
    .then(response => {
        console.log('Made connection with Places API')
        if(!response) {
            console.log('but there is not any data');
        } else {
            const placesInfo = response.data.results;
            const placeNames = placesInfo.map(el => el.name);
            
            res.send(placeNames);
        } 
    })
    .catch(error => res.send(error))
    
}

const addPlace = (req, res, next) => {

} 

const removePlace = () => {
    
}

const fillDB = (req, res, next) => {
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+palmyra+pa&key=${process.env.GOOGLE_API_KEY}`)
    .then(response => {
        console.log('Made connection with Places API')
        if(!response) {
            console.log('but there is not any data');
        } else {
            const placesInfo = response.data;
        } 
    })
    .catch(error => res.send(error))

    res.send('Well hey there');
}

const checkCode = async (req, res, next) => {
    let placeIDs = [];

    try{
        await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+palmyra+pa&fields=place_id&key=${process.env.GOOGLE_API_KEY}`)
        .then(response => {
            console.log('Made connection with Places API')
            if(!response) {
                console.log('but there is not any data');
            } else {
                const placesInfo = response.data.results;

                placeIDs = placesInfo.map(el => el.place_id);
                
                console.log(placeIDs);
            } 
        })
        .catch(error => res.send(error))
    }
    catch(error) {
        console.log(error);
    }

    // axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJGTkOhDylyIkRPdtPfsoaQQo&key=${process.env.GOOGLE_API_KEY}`)
    // .then(async response => {
    //     const data = response.data.result;

    //     const placeResult = await Places.create({
    //         name: data.name,
    //         icon: data.icon,
    //         address_components: {
    //             number: data.address_components[0].long_name,
    //             street: data.address_components[1].long_name,
    //             city: data.address_components[2].long_name,
    //             state: data.address_components[5].short_name,
    //             zip_code: data.address_components[7].long_name,
    //             country: data.address_components[6].short_name
    //         },
    //         business_status: data.business_status,
    //         address: data.formatted_address,
    //         phone_number: data.formatted_phone_number,
    //         geometry: data.geometry,
    //         place_id: data.place_id,
    //         price_level: data.price_level,
    //         rating: data.rating,
    //         website: data.website
    //     })
        
    //     placeResult && console.log('Info placed in DB'); 
    // })
    // .catch(error => console.log(error));

    // const temp = fillHours(placeIDs);
    
    // res.send(temp);

    try {
        const place = await Places.findOne({"place_id": ``});

        console.log(place.name);

        fill
    } catch (error) {
        console.log(error);
    }

    res.send('Called Yo!');
}

const popularTimesDB = async (req, res, next) => {
    try {
        const place = await Places.findOne({"place_id" : "ChIJGTkOhDylyIkRPdtPfsoaQQo"});

        const popularTimes = fillHours("ChIJGTkOhDylyIkRPdtPfsoaQQo", 'dinner', 'breakfast');

        place.popular_times = popularTimes;

        place.save();
    } catch (error) {
        console.log(error);
    }
    
    res.send('popularTimes');
}

const deletePlaces = async (req, res) => {
    try {
        const { email, placesToDelete } = req.body;
        //const places_ids = [];

        // for(let i=0; i<placesToDelete.length; i++) {
        //     const place = await Places.findOne({name: placesToDelete[i]});

        //     places_ids.push(place.place_id);
        // }

        for(let i=0; i<placesToDelete.length; i++) {
            await User.findOneAndUpdate({email: email}, { "$pull": { "places": placesToDelete[i]} });
        }

        res.send({message: 'success'});
    } catch(error) {
        console.log(error);
        res.status(400).json({message: error});
    }
}

const photo = async (req, res, next) => {

    try {
        const all = await Places.find({});
        let place_ids = all.map(el => el.place_id);
        
        for(let i=0; i<place_ids.length; i++) {
            try{
                await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_ids[i]}&key=${process.env.GOOGLE_API_KEY}`)
                .then(async response => {
                    console.log('Made connection with Places API')
                if(!response) {
                    console.log('but there is not any data');
                } else {
                    try {
                        const placesInfo = response.data.result;

                        const photoReference = placesInfo.photos[0].photo_reference;

                        const hours = placesInfo.opening_hours;

                        const apiAddressForPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`;

                        const place = await Places.findOne({place_id: place_ids[i]});

                        place.photo = apiAddressForPhoto;

                        place.hours = hours;

                        place.save();
                    } catch(error) {
                        console.log(`There was an error updating the DB with photos: ${error}`)
                    }
                } 
            })
            .catch(error => res.send(error))
            } catch(error) {
                console.log(`There was an error pulling place info: ${error}`);
            }
        }
    } catch (error) {
        console.log(`There was an error finding places in the Mongo database: ${error}`);
    }

    res.send('noice');
}

const trafficExample = async (req, res, next) => {
    const email = 'desandwich@gmail.com';
    const address = '100+Hersheypark+Drive+Hershey+PA+17033';
    let durations = [];
    let promises = [];
    const userInfo = await User.findOne({email: email});
    const place_ids = userInfo.places;

    promises.push(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${address}&destinations=place_id:${place_ids[1]}&departure_time=now&key=${process.env.GOOGLE_API_KEY}`);
    
    if(place_ids.length === 0) {
        res.status(400).json({message: 'This user does not have any places in their profile'});
    } else {
        Promise.all(promises.map(p => {
            return axios.get(p);
        }))
        .then(async response => {
            for(let i=0; i<response.length; i++) {
                const durationInfo = response[i].data.rows[0].elements[0];
                const url = response[i].config.url;
                const sliceIndexStart = url.indexOf('d:');
                const sliceIndexEnd = url.indexOf('departure');

                const place_id = url.slice(sliceIndexStart+2, sliceIndexEnd-1);

                const placeInfo = await Places.findOne({place_id: place_id}).exec();
                
                durations.push({placeInfo: placeInfo, durationToPlace: durationInfo.duration_in_traffic.value});
            }

            const timeInMinutes = (time) => {
                const seconds = Math.floor((time % 60));

                return `It will take about ${seconds >= 30 ? Math.ceil(time / 60) : Math.floor(time / 60)} minutes to get to the destination in current traffic`;
            }

            const exampleObj = {
                user: email,
                origin_Address: address.replaceAll('+', ' '),
                destination_Address: `${durations[0].placeInfo.address_components.number} ${durations[0].placeInfo.address_components.street} ${durations[0].placeInfo.address_components.city} ${durations[0].placeInfo.address_components.state} ${durations[0].placeInfo.address_components.zip_code}`,
                time_To_Destination_In_Current_traffic: timeInMinutes(durations[0].durationToPlace),
            }

            res.header("Content-Type",'application/json');
            res.send(JSON.stringify(exampleObj, null, 4));
        }).catch(error => {
            console.log(error);
            res.status(400).json({message: 'Something is wrong'});
        })
    }
}

const restaurantDataExample = async (req, res, next) => {
    const email = 'desandwich@gmail.com';
    const userInfo = await User.findOne({email: email});
    const place_ids = userInfo.places;

    const placeInfo = await Places.findOne({place_id: place_ids[0]}).exec();

    const exampleObj = {
        user: email,
        data_For_One_User_Saved_Restaurant: placeInfo,
    }

    try {
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(exampleObj, null, 4));
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
} 

const findTimeToPlace = async (req, res, next) => {
    const { address, email } = req.body;
    let durations = [];
    let promises = [];
    const userInfo = await User.findOne({email: email});
    const place_ids = userInfo.places;

    for(let i=0; i<place_ids.length; i++) {
        promises.push(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${address}&destinations=place_id:${place_ids[i]}&departure_time=now&key=${process.env.GOOGLE_API_KEY}`);
    }


    if(place_ids.length === 0) {
        res.status(400).json({message: 'This user does not have any places in their profile'});
    } else {
        Promise.all(promises.map(p => {
            return axios.get(p);
        }))
        .then(async response => {
            for(let i=0; i<response.length; i++) {
                const durationInfo = response[i].data.rows[0].elements[0];
                const url = response[i].config.url;
                const sliceIndexStart = url.indexOf('d:');
                const sliceIndexEnd = url.indexOf('departure');

                const place_id = url.slice(sliceIndexStart+2, sliceIndexEnd-1);

                const placeInfo = await Places.findOne({place_id: place_id}).exec();
                
                durations.push({placeInfo: placeInfo, durationToPlace: durationInfo.duration_in_traffic.value});
            }

            res.send({durations: durations});
        }).catch(error => {
            console.log(error);
            res.status(400).json({message: error});
        })
    }
}

const addRes = async (req, res, next) => {
    const { place, email } = req.body;
    let apiAddressForPhoto;
    let newPlace;
    let newUserPlace;

    try{
        await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photo&key=${process.env.GOOGLE_API_KEY}`)
        .then(async response => {
            const photoInfo = response.data.result;

            const photoReference = photoInfo.photos[0].photo_reference;

            apiAddressForPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`;
        })
    } catch(error) {
        console.log(`There was an error pulling place info: ${error}`);
    }

    const findAddressComponent = (componentType) => {
        const componentIndex = place.address_components.findIndex(el => el.types[0] === componentType);

        const type = place.address_components[componentIndex];

        if(type.types[0] === 'administrative_area_level_1' || type.types[0] === 'country') {
            return type.short_name;
        } else {
            return type.long_name;
        }
    }

    const formattedPhoneNumber = (phoneNumber) => {
        const spaceIndex = phoneNumber.indexOf(' ');

        const formattedNumber = phoneNumber.slice(spaceIndex + 1);
        
        return formattedNumber;
    }

    try{
        await Places.countDocuments({place_id: place.place_id}, async function(err, count) {
            if(count === 0) {
                try{
                    newPlace = await Places.create({
                        name: place.name,
                        icon: place.icon,
                        address_components: {
                            number: findAddressComponent('street_number'),
                            street: findAddressComponent('route'),
                            city: findAddressComponent('locality'),
                            state: findAddressComponent('administrative_area_level_1'),
                            zip_code: findAddressComponent('postal_code'),
                            country: findAddressComponent('country')
                        },
                        business_status: place.business_status ? place.business_status : 'No Business Status',
                        address: place.formatted_address,
                        phone_number: place.international_phone_number ? (formattedPhoneNumber(place.international_phone_number)) : 'No Phone Number',
                        geometry: place.geometry,
                        place_id: place.place_id,
                        price_level: place.price_level,
                        rating: place.rating,
                        website: place.website ? place.website : 'No Website',
                        hours: place.opening_hours,
                        photo: apiAddressForPhoto,
                        popular_times: fillHours(place.opening_hours, 'dinner', 'breakfast')
                    })

                    if(newPlace === null) {
                        res.send({message: 'failure'})
                    } else {
                        const userPlaces = await User.findOne({email: email});
                
                        if(userPlaces.places.includes(place.place_id)) {
                            res.send({message: 'exists'});
                        } else {
                            userPlaces.places.push(place.place_id);
                
                            userPlaces.save();
                
                            newUserPlace = true;
                        }
                
                        newPlace || newUserPlace ? res.status(200).send({message: 'success'}) : res.status(400).send({message: 'failure'});
                    }
                } catch(error) {
                    console.log(error);
                }
            } else if (count > 0) {
                try{
                    const userPlaces = await User.findOne({email: email});

                    if(userPlaces.places.includes(place.place_id)) {
                        res.send({message: 'exists'});
                    } else {
                        userPlaces.places.push(place.place_id);

                        userPlaces.save();

                        newUserPlace = true;
                    }

                    newPlace || newUserPlace ? res.status(200).send({message: 'success'}) : res.status(400).send({message: 'failure'});
                } catch(error) {
                    console.log(error);
                }
            }
        });
    } catch (error) {
        console.log(error)
    }

}

module.exports = { viewPlace, addPlace, removePlace, fillDB, checkCode, popularTimesDB, deletePlaces, photo, findTimeToPlace, addRes, trafficExample, restaurantDataExample };