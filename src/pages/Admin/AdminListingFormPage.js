import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ListingForm from '../../components/forms/ListingForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import listingService from '../../services/listingService';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminListingFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [listingData, setListingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            if (isEditMode) {
                setLoading(true);
                try {
                    const axiosResponse = await listingService.getListingById(id);
                    const apiResponseData = axiosResponse.data;
                    setListingData(apiResponseData.data.listing);
                    setError(null);
                } catch (err) {
                    console.error("Error in fetchListing (AdminListingFormPage):", err);
                    setError(err.response?.data?.message || 'Failed to fetch listing for editing.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchListing();
    }, [id, isEditMode]);

    const handleSubmit = async (formData) => {
        setSubmitLoading(true);
        setSubmitError(null);
        try {
            if (isEditMode) {
                await listingService.updateListing(id, formData);
                alert('Listing updated successfully!');
            } else {
                await listingService.createListing(formData);
                alert('Listing added successfully and is pending approval!');
            }
            navigate('/admin/listings');
        } catch (err) {
            console.error("Error in handleSubmit (AdminListingFormPage):", err);
            setSubmitError(err.response?.data?.message || 'Operation failed. Please check your inputs.');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <AdminLayout>
                <Alert type="danger" message={error} dismissible />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="mb-4">{isEditMode ? 'Edit Listing' : 'Add New Listing'}</h1>
            <ListingForm
                onSubmit={handleSubmit}
                initialData={listingData}
                loading={submitLoading}
                error={submitError}
                isEditMode={isEditMode}
            />
        </AdminLayout>
    );
};

export default AdminListingFormPage;