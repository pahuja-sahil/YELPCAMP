const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const getImage = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                collections: '9046579',
                client_id: 'zrBFIei-U8QH2I4bwWW0Nxwj0DbalijPdFVMd26InEE', // Your Unsplash Access Key
            },
        });
        return response.data.urls.small;
    } catch (error) {
        console.error('Error fetching image:', error.response.data);
        return 'https://via.placeholder.com/300'; // Fallback image
    }
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 15; i++) {
        const { city, state ,longitude,latitude} = sample(cities);
        const price = Math.floor(Math.random() * 50) + 10;
        const image = await getImage();
        const camp = new Campground({
            author: '66a478125d2e55058ea1f769',
            location: `${city}, ${state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            price,
            geometry: {
            type: 'Point',
            coordinates: [
                longitude,
                latitude,
              ],
            },
            images: [
            {
                url: 'https://res.cloudinary.com/dtfihx8ib/image/upload/v1722712553/YelpCamp/zpqvwjxqwyseyfhjd0kw.jpg',
                filename: 'YelpCamp/zpqvwjxqwyseyfhjd0kw'
            },
            {
                url: 'https://res.cloudinary.com/dtfihx8ib/image/upload/v1722712555/YelpCamp/num00f3qt39qzbqxhgxc.jpg',
                filename: 'YelpCamp/num00f3qt39qzbqxhgxc'
            }
            ]

        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});