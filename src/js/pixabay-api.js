import axios from "axios";

const API_KEY = '43248873-3ce9b820c5f26b6ef0afaa018';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page = 1, perPage = 15) {
    const params = {
        key: API_KEY,
        q: searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: page,
        per_page: perPage
    };

    try {
        const response = await axios.get(BASE_URL, { params: params });
        const data = response.data;
        
        if (data.hits.length === 0) {
            throw new Error('Sorry, there are no images matching your search query. Please try again!');
        }
        
        return {
            images: data.hits,
            totalHits: data.totalHits
        };
    } catch (error) {
        throw new Error('Network response was not ok');
    }
}
