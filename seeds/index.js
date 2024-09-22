const mongoose = require('mongoose');
const axios = require('axios');
// const cities = require('./cities');
// const { places, descriptors } = require('./seedHelpers');
require('dotenv').config();
const key = process.env.API_KEY;
const mainAuth = process.env.OWNER_ID;
const Campground = require('../models/campground');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");
const { reverseGeo } = require('../tools');


mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Database connected');
    try {
        await seedDB();
    } catch (error) {
        console.log('Error during seeding:', error);
    } finally {
        mongoose.connection.close();
    }
});

// const createUser = async() => {
//     const user = new User({ email, username });
//     const registeredUser = await User.register(user, password);
// }    

const processDatas = async () => {
    try {
        const config = {
            params: {
                api_key: key
            }
        };
        const res = await axios.get(`https://developer.nps.gov/api/v1/campgrounds?limit=100`, config);
        return res;
    } catch (e) {
        console.log("Connection timeout");
        console.log(e.message);
    }
}

async function upload(images, camp) {
    for (let i = 0; i < images.length; i++) {
        try {
            // Store the result after upload and insert it into camp images
            const res = await cloudinary.uploader.upload_large(images[i], { folder: process.env.FOLDER_NAME });
            camp.images.push({ url: res.secure_url, filename: res.original_filename });
        } catch (e) {
            if (i === 0) {
                camp.success = 'fail';
                console.log(e);
            }
        }
    }
}

const seedDB = async () => {
    try {
        await Campground.deleteMany({});
        const res = await processDatas();

        for (let camp of res.data.data) {
            if (camp.images && camp.images[0]) {
                const price = Math.floor(Math.random() * 20) + 10;
                const campground = new Campground({
                    author: mainAuth,
                    location: camp.addresses[0]
                        ? `${camp.addresses[0].line1} ${camp.addresses[0].city} ${camp.addresses[0].stateCode}`
                        : await reverseGeo([Number.parseFloat(camp.longitude), Number.parseFloat(camp.latitude)]),
                    title: camp.name,
                    description: camp.description,
                    price: camp.fees[0] ? camp.fees[0].cost : price,
                    geometry: {
                        type: 'Point',
                        coordinates: [camp.longitude, camp.latitude]
                    }
                });

                // Upload the images and save the campground if successful
                await upload(camp.images.map(img => img.url), campground);

                if (campground.success !== 'fail') {
                    await campground.save().catch((err) => {
                        // console.log("Error saving campground:", err);
                    });
                } else {
                    console.log("Image upload failed, campground not saved.");
                }
            }
        }
    } catch (error) {
        console.log("Seeding error:", error);
    }
};

                    // mongoose.connect(process.env.MONGO_URI);
                    
                    // const db = mongoose.connection;
                    
                    // db.on('error', console.error.bind(console, 'connection error:'));
                    // db.once('open', async () => {
                    //     console.log('Database connected');
                    //     // seedDB().then(() => {
                    //     //     mongoose.connection.close();
                    //     // });
                    // });
                    
                    // // const sample = (array) => array[Math.floor(Math.random() * array.length)];
                    
                    // // const getImage = async () => {
                    // //     try {
                    // //         const response = await axios.get('https://api.unsplash.com/photos/random', {
                    // //             params: {
                    // //                 collections: '9046579',
                    // //                 client_id: 'zrBFIei-U8QH2I4bwWW0Nxwj0DbalijPdFVMd26InEE', // Your Unsplash Access Key
                    // //             },
                    // //         });
                    // //         return response.data.urls.small;
                    // //     } catch (error) {
                    // //         console.error('Error fetching image:', error.response.data);
                    // //         return 'https://via.placeholder.com/300'; // Fallback image
                    // //     }
                    // // };
                    
                    // //get seeding data from nps api
                    // const processDatas = async () => {
                    //     // async function processDatas() {
                    //     try {
                    //         const config = {
                    //             params:
                    //             {
                    //                 api_key: key
                    //             }
                    //         };
                    //         const res = await axios.get(`https://developer.nps.gov/api/v1/campgrounds?limit=5`, config);
                    //         return res;
                    //     } catch (e) {
                    //         console.log("Connection timeout")
                    //         console.log(e);
                    //     }
                    // }
                    
                    // async function upload(images, camp) {
                    //     for (let i = 0; i < images.length; i++) {
                    //         try {
                    //             //store the result after upload and insert in camp images
                    //             const res = await cloudinary.uploader.upload_large(images[i], { folder: 'YelpCamp' });
                    //             camp.images.push({ url: res.secure_url, filename: res.original_filename });
                    //         } catch (e) {
                    //             // console.log("error:", e);
                    //             if (i === 0) {
                    //                 camp.success = 'fail';
                    //             }
                    //         }
                    //     }
                    // }
                    
                    // const seedDB = async () => {
                    //     // async function seedDB() {
                    //     try {
                    //         await Campground.deleteMany({});
                    
                    
                    //         const res = await processDatas();
                    //         res.data.data.forEach(async (camp) => {
                    //             if (camp.images[0]) {
                    //                 const price = Math.floor(Math.random() * 20) + 10;
                    //                 const campground = new Campground({
                    //                     author: mainAuth,
                    //                     //do reverse lookup here!!!!!from the coordinates if no address available
                    //                     location: camp.addresses[0] ?
                    //                         `${camp.addresses[0].line1} ${camp.addresses[0].city} ${camp.addresses[0].stateCode}` :
                    //                         await reverseGeo([Number.parseFloat(camp.longitude, 10), Number.parseFloat(camp.latitude, 10)]),
                    
                    //                     title: camp.name,
                    
                    //                     description: camp.description,
                    //                     //assign a random price if there is no cost
                    //                     price: camp.fees[0] ? camp.fees[0].cost : price,
                    
                    //                     geometry: {
                    //                         type: 'Point',
                    //                         coordinates: [
                    //                             camp.longitude,
                    //                             camp.latitude
                    //                         ]
                    //                     }
                    //                 })
                    //                 await upload(camp.images.map(img => img.url), campground);
                    //                 // await User.findByIdAndUpdate(mainAuth, { $push: { campgrounds: campground } });
                    //                 if (campground.success !== 'fail') {
                    //                     // await campground.save();
                    //                     campground.save().then(() => {
                    //                     }).catch((err) => {
                    //                         console.log("yaha h error:");
                    //                     });
                    //                     // console.log("SUCCESS:", campground);
                    //                 } else {
                    //                     // console.log("FAILED:", campground);
                    //                 }
                    //                 // await campground.save();
                    
                    //             }
                    //         })
                    
                    //     } catch (error) {
                    //         console.log("TIMEOUT:", error)
                    //     }
                    //     // await Campground.deleteMany({});
                    //     // for (let i = 0; i < 15; i++) {
                    //     //     const { city, state ,longitude,latitude} = sample(cities);
                    //     //     const price = Math.floor(Math.random() * 50) + 10;
                    //     //     const image = await getImage();
                    //     //     const camp = new Campground({
                    //     //         author: '66a478125d2e55058ea1f769',
                    //     //         location: `${city}, ${state}`,
                    //     //         title: `${sample(descriptors)} ${sample(places)}`,
                    //     //         description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    //     //         price,
                    //     //         geometry: {
                    //     //         type: 'Point',
                    //     //         coordinates: [
                    //     //             longitude,
                    //     //             latitude,
                    //     //           ],
                    //     //         },
                    //     //         images: [
                    //     //         {
                    //     //             url: 'https://res.cloudinary.com/dtfihx8ib/image/upload/v1722712553/YelpCamp/zpqvwjxqwyseyfhjd0kw.jpg',
                    //     //             filename: 'YelpCamp/zpqvwjxqwyseyfhjd0kw'
                    //     //         },
                    //     //         {
                    //     //             url: 'https://res.cloudinary.com/dtfihx8ib/image/upload/v1722712555/YelpCamp/num00f3qt39qzbqxhgxc.jpg',
                    //     //             filename: 'YelpCamp/num00f3qt39qzbqxhgxc'
                    //     //         }
                    //     //         ]
                    
                    //     //     });
                    //     //     await camp.save();
                    //     // }
                    // };
                    
                    // seedDB().then(() => {
                    //     mongoose.connection.close();
                    // });