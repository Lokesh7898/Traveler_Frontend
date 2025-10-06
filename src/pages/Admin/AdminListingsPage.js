import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import listingService from '../../services/listingService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import AppTable from '../../components/common/AppTable';

const AdminListingsPage = () => {
    const { user } = useContext(AuthContext);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const listingsPerPage = 10;

    const navigate = useNavigate();

    const fetchAdminListings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const axiosResponse = await listingService.getListings({
                status: 'all',
                page: currentPage,
                limit: listingsPerPage
            });

            const apiResponseData = axiosResponse.data;

            if (apiResponseData && apiResponseData.pagination) {
                setListings(Array.isArray(apiResponseData.data.listings) ? apiResponseData.data.listings : []);
                setCurrentPage(apiResponseData.pagination.currentPage);
                setTotalPages(apiResponseData.pagination.totalPages);
                setTotalResults(apiResponseData.pagination.totalResults);
                setError(null);
            } else {
                console.warn("API response missing pagination data:", apiResponseData);
                setError("API response did not contain expected pagination data.");
                setListings([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalResults(0);
            }
        } catch (err) {
            console.error("Error in fetchAdminListings:", err);
            setError(err.response?.data?.message || 'Failed to fetch listings for admin. Please check console.');
            setListings([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, listingsPerPage]);

    useEffect(() => {
        fetchAdminListings();
    }, [fetchAdminListings]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            setLoading(true);
            try {
                await listingService.deleteListing(id);
                setError(null);
                fetchAdminListings();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete listing.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (window.confirm(`Are you sure you want to change this listing's status to "${newStatus}"?`)) {
            setLoading(true);
            try {
                await listingService.updateListingStatus(id, newStatus);
                setError(null);
                fetchAdminListings();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to update listing status.');
            } finally {
                setLoading(false);
            }
        }
    };

    const listingHeaders = ['#', 'Title', 'Location', 'Price', 'Status', 'Host', 'Actions'];
    const renderListingRow = (listing, index) => {
        const hostName = listing.host ? listing.host.name : 'N/A';

        return (
            <tr key={listing._id}>
                <td>{(currentPage - 1) * listingsPerPage + index + 1}</td>
                <td>{listing.title}</td>
                <td>{listing.location}</td>
                <td>${listing.price}</td>
                <td>
                    <Badge
                        bg={
                            listing.status === 'approved'
                                ? 'success'
                                : listing.status === 'pending'
                                    ? 'warning'
                                    : 'danger'
                        }
                    >
                        {listing.status}
                    </Badge>
                </td>
                <td>{hostName}</td>
                <td className="d-flex flex-nowrap gap-2 justify-content-start align-items-center">
                    <Link to={`/admin/listings/edit/${listing._id}`}>
                        <Button variant="info" size="sm" className="d-flex align-items-center">
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                    </Link>
                    <Button variant="danger" size="sm" className="d-flex align-items-center" onClick={() => handleDelete(listing._id)}>
                        <i className="bi bi-trash"></i>
                    </Button>
                    {listing.status === 'pending' && (
                        <Button variant="success" size="sm" className="d-flex align-items-center" onClick={() => handleUpdateStatus(listing._id, 'approved')}>
                            <i className="bi bi-check-circle"></i>
                        </Button>
                    )}
                    {listing.status === 'approved' && (
                        <Button variant="warning" size="sm" className="d-flex align-items-center" onClick={() => handleUpdateStatus(listing._id, 'pending')}>
                            <i className="bi bi-exclamation-triangle"></i>
                        </Button>
                    )}
                    {listing.status !== 'rejected' && (
                        <Button variant="secondary" size="sm" className="d-flex align-items-center" onClick={() => handleUpdateStatus(listing._id, 'rejected')}>
                            <i className="bi bi-x-circle"></i>
                        </Button>
                    )}
                </td>
            </tr>
        );
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <AdminLayout>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1 className="mb-0">Manage Listings</h1>
                </Col>
                <Col className="text-end">
                    <Link to="/admin/listings/new">
                        <Button variant="primary" className="d-flex align-items-center float-end">
                            <i className="bi bi-plus-lg me-2"></i> Add New Listing
                        </Button>
                    </Link>
                </Col>
            </Row>

            {error && <Alert type="danger" message={error} dismissible />}

            {!loading && Array.isArray(listings) && (
                <AppTable
                    headers={listingHeaders}
                    data={listings}
                    renderRow={renderListingRow}
                    emptyMessage="No listings to manage. Add a new one!"
                />
            )}

            {totalResults > listingsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </AdminLayout>
    );
};

export default AdminListingsPage;