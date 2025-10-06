import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SearchForm from '../../components/forms/SearchForm';
import ListingCard from '../../components/common/Card';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import listingService from '../../services/listingService';

const ListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [searchParams, setSearchParams] = useState({});
    const listingsPerPage = 10;

    const fetchListings = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const axiosResponse = await listingService.getListings({
                ...params,
                page: currentPage,
                limit: listingsPerPage,
            });
            const apiResponseData = axiosResponse.data;

            if (apiResponseData && apiResponseData.pagination) {
                setListings(Array.isArray(apiResponseData.data.listings) ? apiResponseData.data.listings : []);
                setCurrentPage(apiResponseData.pagination.currentPage);
                setTotalPages(apiResponseData.pagination.totalPages);
                setTotalResults(apiResponseData.pagination.totalResults);
                setError(null);
            } else {
                console.warn("API response missing pagination data for public listings:", apiResponseData);
                setError("API response did not contain expected pagination data.");
                setListings([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalResults(0);
            }
        } catch (err) {
            console.error("Error in fetchListings (Public):", err);
            setError(err.response?.data?.message || 'Failed to fetch listings. Please try again.');
            setListings([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, listingsPerPage]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchListings(searchParams);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [fetchListings, searchParams]);

    const handleSearch = (params) => {
        setSearchParams(params);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Find Your Next Adventure</h2>
            <SearchForm onSearch={handleSearch} />

            {loading && <LoadingSpinner />}
            {error && <Alert type="danger" message={error} dismissible />}
            {!loading && !error && listings.length === 0 && totalResults === 0 && (
                <Alert type="info" message="No listings found matching your criteria. Try adjusting your search." />
            )}

            {!loading && !error && listings.length > 0 && (
                <>
                    <p className="text-muted">Showing {listings.length} of {totalResults} results.</p>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {listings.map((listing) => (
                            <Col key={listing._id}>
                                <ListingCard listing={listing} />
                            </Col>
                        ))}
                    </Row>
                    {totalResults > listingsPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default ListingsPage;