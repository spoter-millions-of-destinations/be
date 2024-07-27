import axios from 'axios';

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

interface Coordinates {
  longitude: number;
  latitude: number;
}

export class MapboxResponse {
  placeName: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
}

export async function getPlaceFromCoordinates(coords: Coordinates): Promise<MapboxResponse> {
  const { longitude, latitude } = coords;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response?.data?.features;
    return {
      placeName: data[0]?.text || '',
      address: data[0]?.properties?.address || '',
      ward: data?.find((d: any) => d?.place_type?.includes('neighborhood'))?.text || '',
      district: data?.find((d: any) => d?.place_type?.includes('locality'))?.text || '',
      city: data?.find((d: any) => d?.place_type?.includes('place'))?.text || '',
      country: data?.find((d: any) => d?.place_type?.includes('country'))?.text || '',
      longitude: data[0]?.center[0] || longitude,
      latitude: data[0]?.center[1] || latitude,
    };
  } catch (error) {
    console.error('Error fetching place from coordinates:', error);
    throw new Error('Unable to fetch place from coordinates');
  }
}

export async function getPlaceFromSearchText(searchText: string): Promise<MapboxResponse> {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${searchText}&access_token=${MAPBOX_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response?.data?.features;
    return {
      longitude: data[0]?.geometry?.coordinates[0] || 0,
      latitude: data[0]?.geometry?.coordinates[1] || 0,
      placeName: data[0]?.properties?.name || '',
      address: data[0]?.properties?.full_address || '',
      ward: data[0]?.properties?.context?.neighborhood?.name || '',
      district: data[0]?.properties?.context?.locality?.name || '',
      city: data[0]?.properties?.context?.region?.name || '',
      country: data[0]?.properties?.context?.country?.name || '',
    };
  } catch (error) {
    console.error('Error fetching coordinates from place:', error);
    throw new Error('Unable to fetch coordinates from place');
  }
}
