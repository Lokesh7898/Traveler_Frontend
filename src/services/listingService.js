import axiosInstance from '../utils/apiResponseHandler';

const listingService = {
    getListings: (params) => {
        const isAdminSpecificCall = params.status === 'all' || params.status === 'pending' || params.status === 'rejected';
        const endpoint = isAdminSpecificCall ? '/admin/listings' : '/listings';
        return axiosInstance.get(endpoint, { params });
    },
    getListingById: (id) => axiosInstance.get(`/listings/${id}`),
    createListing: (listingData) => axiosInstance.post('/admin/listings', listingData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateListing: (id, listingData) => axiosInstance.patch(`/admin/listings/${id}`, listingData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteListing: (id) => axiosInstance.delete(`/admin/listings/${id}`),
    updateListingStatus: (id, status) => axiosInstance.patch(`/admin/listings/${id}/status`, { status }),
};

export default listingService;