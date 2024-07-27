import axios from 'axios';

const apiKey = 'AIzaSyAM1PbrnS4gVSNHyRshJE1Fg7-Kozbzfqo'; // Thay bằng API key của bạn
const location = '16.0544,108.2022'; // Tọa độ của Đà Nẵng
const radius = 5000; // Bán kính tìm kiếm tính bằng mét
const type = 'tourist_attraction'; // Loại địa điểm cần tìm kiếm

const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

interface Place {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

axios
  .get(url)
  .then((response) => {
    if (response.data.results) {
      response.data.results.forEach((place: Place) => {
        console.log(`Name: ${place.name}`);
        console.log(`Latitude: ${place.geometry.location.lat}`);
        console.log(`Longitude: ${place.geometry.location.lng}`);
        console.log('---');
      });
    } else {
      console.log('No places found.');
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
