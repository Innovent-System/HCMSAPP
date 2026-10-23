import React, { useId, useRef, useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Pagination } from '../../../../deps/ui'

import PayslipView from '../../components/FNFReportView';
import { formateDate } from '@/services/dateTimeService';

const pagination = {
    display: 'flex',
    justifyContent: 'center',
}

const FNFViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const _key = useId();
    const currentFNF = useRef({ id: _key });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(1);

    const handleRecord = (data) => {
        setRecords(data)
        currentFNF.current = {
            ...data[0],
            generatedOn: formateDate(new Date)
        }
        setPage(1);
    }
    const handleChangePage = (event, value) => {
        const currentRec = records[value - 1];
        currentFNF.current = {
            ...currentRec,
            generatedOn: formateDate(new Date)
        };
        setPage(value);
    }

    return (
        <BaseReportWrapper API_NAME={API_NAME} fileName={fileName}
            handleRecord={handleRecord}
            pagination={<Pagination
                showFirstButton
                showLastButton
                sx={pagination}
                count={Math.ceil(records.length / rowsPerPage)}
                // page={page}
                onChange={handleChangePage}
            />}
        >
            <PayslipView key={currentFNF.current?.id} {...currentFNF.current} />
        </BaseReportWrapper>
    )
}

export default FNFViewer