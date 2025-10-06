import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages && pageNumber !== currentPage) {
            onPageChange(pageNumber);
        }
    };

    const renderPageItems = () => {
        const items = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

        if (endPage - startPage + 1 < maxPagesToShow) {
            if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
                endPage = Math.min(totalPages, maxPagesToShow);
            } else {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            }
        }

        items.push(
            <BSPagination.First key="first" onClick={() => handlePageClick(1)} disabled={currentPage === 1} />
        );
        items.push(
            <BSPagination.Prev key="prev" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} />
        );

        if (startPage > 1) {
            items.push(<BSPagination.Item key={1} onClick={() => handlePageClick(1)}>1</BSPagination.Item>);
            if (startPage > 2) {
                items.push(<BSPagination.Ellipsis key="start-ellipsis" />);
            }
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <BSPagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageClick(number)}
                >
                    {number}
                </BSPagination.Item>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<BSPagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(<BSPagination.Item key={totalPages} onClick={() => handlePageClick(totalPages)}>{totalPages}</BSPagination.Item>);
        }

        items.push(
            <BSPagination.Next key="next" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} />
        );
        items.push(
            <BSPagination.Last key="last" onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages} />
        );

        return items;
    };

    if (totalPages <= 1) return null;

    return (
        <BSPagination className="justify-content-center mt-4">
            {renderPageItems()}
        </BSPagination>
    );
};

export default Pagination;