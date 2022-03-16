const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel.js');
const Places = require('../models/placesModel.js');
const { getMaxListeners } = require('../models/placesModel.js');

const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if(existingUser) {
            return res.status(400).json({ message: 'User Already Exists. Please Sign In.'});
        }

        if(password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let result = await User.create({ email: email.toLowerCase(), password: hashedPassword, name: `${firstName} ${lastName}`});

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: '1h' });
 
        res.status(200).json({ result, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong while signing up'});
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if(!existingUser) {
            return res.status(400).json({ message: 'User Does Not Exist. Please Sign Up!'});
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);

        if(!checkPassword) {
            return res.status(400).json({ message: 'Invalid Credentials'});
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong while signing in'});
    }
}

const userPlaces = async (req, res) => {
    try {
        const { email } = req.body;
        const userInfo = await User.findOne({email: email});
        const place_ids = userInfo.places;

        if(place_ids.length === 0) {
            res.status(400).json({message: 'This user does not have any places in their profile'});
        } else {
            Promise.all(place_ids.map(place => {
                return Places.findOne({place_id: place}).exec();
            }))
            .then(foundPlaces => {
                res.send({userPlaces: foundPlaces});
            }).catch(error => {
                res.status(400).json({message: error});
            })
        }
    } catch(error) {
        res.status(400).json({message: error});
    }
}

const userProfileInfoExample = async (req, res) => {
    try {
        const userInfo = await User.findOne({email: 'desandwich@gmail.com'});
        const place_ids = userInfo.places;
        const { addresses, email, name } = userInfo;

        Promise.all(place_ids.map(place => {
            return Places.findOne({place_id: place}).exec();
        }))
        .then(foundPlaces => {
            const exampleObj = {
                email: email, 
                name: name, 
                userPlaces: `Array length: ${foundPlaces.length} restaurants`, 
                addresses: `Array length: ${addresses.length} addresses`
            }
            res.header("Content-Type",'application/json');
            res.send(JSON.stringify(exampleObj, null, 4));
        }).catch(error => {
            console.log(error);
            res.status(400).json({message: error});
        })
    } catch(error) {
        res.status(400).json({message: error});
    }
}

const userProfileInfo = async (req, res) => {
    try {
        const { email } = req.body;
        const userInfo = await User.findOne({email: email});
        const place_ids = userInfo.places;
        const addresses = userInfo.addresses;

        Promise.all(place_ids.map(place => {
            return Places.findOne({place_id: place}).exec();
        }))
        .then(foundPlaces => {
            res.send({userPlaces: foundPlaces, addresses: addresses});
        }).catch(error => {
            res.status(400).json({message: error});
        })
    } catch(error) {
        res.status(400).json({message: error});
    }
}

const addAddress = async (req, res, next) => {
    const { label, address_components, email } = req.body;

    const findAddressComponent = (componentType) => {
        const componentIndex = address_components.findIndex(el => el.types[0] === componentType);

        const type = address_components[componentIndex];

        if(type.types[0] === 'administrative_area_level_1' || type.types[0] === 'country') {
            return type.short_name;
        } else {
            return type.long_name;
        }
    }

    try {
        const userAddresses = await User.findOne({email: email});

        const addressObject = {
            label: label,
            number: findAddressComponent('street_number'),
            street: findAddressComponent('route'),
            city: findAddressComponent('locality'),
            state: findAddressComponent('administrative_area_level_1'),
            zip: findAddressComponent('postal_code'),
        }

        if(userAddresses.addresses.some(el => el.label === label)) {
            res.send({message: 'exists'});
        } else {
            userAddresses.addresses.push(addressObject);

            userAddresses.save();

            res.status(200).send({message: 'success'});
        }
    } catch (error) {
        res.send({message: 'failure'});
        console.log(error);
    }
}

const editAddress = async (req, res, next) => {
    const { email, editedAddress, addressIdentifier } = req.body;
    const { label, street, city, state, zip } = editedAddress;

    try {
        const spaceIndex = street.indexOf(' ');

        const number = street.slice(0, spaceIndex);

        const streetName = street.slice(spaceIndex + 1);

        const user = await User.findOne({email: email});

        const newAddressObject = {
            label: label,
            number: number,
            street: streetName,
            city: city,
            state: state,
            zip: zip,
        }

        const addressIndex = user.addresses.findIndex(el => el.label === addressIdentifier);

        user.addresses.splice(addressIndex, 1);

        user.addresses.push(newAddressObject);

        user.save();

        res.status(200).send({message: 'success'});
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'Failure'});
    }

}

const deleteAddress = async (req, res, next) => {
    const { email, addressesToDelete } = req.body;

    try {
        console.log(addressesToDelete);

        for(let i=0; i<addressesToDelete.length; i++) {
            await User.findOneAndUpdate({email: email}, { "$pull": { "addresses": { 'label': addressesToDelete[i]}}});
        }

        res.status(200).send({message: 'success'});
        
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'Failure'});
    }
}

const changePassword = async (req, res, next) => {
    const { email, currentPass, newPass, repeatNewPass } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if(newPass !== repeatNewPass) {
            return res.status(400).json({ message: 'New passwords do not match'});
        } else if (currentPass === newPass) {
            return res.status(400).json({ message: 'The new password cannot match the current password'});
        }

        const checkPassword = await bcrypt.compare(currentPass, user.password);

        if(checkPassword) {
            const hashedPassword = await bcrypt.hash(newPass, 10);

            user.password = hashedPassword;

            user.save();

            res.status(200).json({ message: 'Password Changed' });
        } else {
            return res.status(400).json({ message: 'Entered password is not correct'});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong while updating password'});
    }
}


module.exports = { signUp, signIn, userPlaces, userProfileInfo, userProfileInfoExample, addAddress, editAddress, deleteAddress, changePassword };