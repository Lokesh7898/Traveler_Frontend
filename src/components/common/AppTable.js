import React from 'react';
import { Table } from 'react-bootstrap';

const AppTable = ({ headers, data, renderRow, emptyMessage = "No data found." }) => {
    return (
        <div className="table-responsive">
            <Table striped bordered hover className="shadow-sm bg-white">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => renderRow(item, index))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center text-muted py-3">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AppTable;