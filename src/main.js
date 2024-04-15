import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from "./js/pixabay-api";
import { gallery, renderImages } from "./js/render-functions";

const searchForm = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

let currentPage = 1;
let currentSearchQuery = '';
const perPage = 15;

async function handleSubmit(event) {
    event.preventDefault();

    const searchInput = document.querySelector('.search-input');
    const searchQuery = searchInput.value.trim();

    if (!searchQuery) {
        showErrorToast('Search query cannot be empty');
        return;
    }

    loader.style.display = 'block';
    gallery.innerHTML = '';
    currentPage = 1;
    currentSearchQuery = searchQuery;

    try {
        const { images, totalHits } = await fetchImages(currentSearchQuery, currentPage, perPage);
        handleFetchSuccess(images, totalHits);
        toggleLoadMoreButton(true);
    } catch (error) {
        handleFetchError(error);
        toggleLoadMoreButton(false);
    }
    
    searchInput.value = '';
}

function showErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message,
    });
}

function showSuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message,
    });
}

function handleFetchSuccess(images, totalHits) {
    loader.style.display = 'none';
    renderImages(images);
    showSuccessToast('Images loaded successfully');
    
    if (currentPage * perPage >= totalHits) {
        toggleLoadMoreButton(false);
        showErrorToast("We're sorry, but you've reached the end of search results.");
    }
}

function handleFetchError(error) {
    loader.style.display = 'none';
    showErrorToast(error.message);
}

function toggleLoadMoreButton(show) {
    if (show) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

async function loadMoreImages() {
    currentPage += 1;

    try {
        const { images, totalHits } = await fetchImages(currentSearchQuery, currentPage, perPage);
        appendImages(images);
        if (currentPage * perPage >= totalHits) {
            toggleLoadMoreButton(false);
            showErrorToast("We're sorry, but you've reached the end of search results.");
        }
    } catch (error) {
        showErrorToast(error.message);
    }
}

function appendImages(images) {
    renderImages(images);
    scrollToNextPage();
}

function scrollToNextPage() {
    const galleryItemHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
    window.scrollBy({
        top: galleryItemHeight * 2,
        behavior: 'smooth'
    });
}
