import React, { useId, useRef, useState } from 'react'
import { BaseReportWrapper } from '../../../../components/ReportViewer';
import { Pagination } from '../../../../deps/ui'

import PayslipView from '../../components/PayslipView';
import { formateDate } from '@/services/dateTimeService';

const pagination = {
    display: 'flex',
    justifyContent: 'center',
}

const PaySlipViewer = ({ API_NAME, fileName }) => {

    const [records, setRecords] = useState([]);
    const _key = useId();
    const currenSlip = useRef({ id: _key });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(1);

    const handleRecord = (data) => {
        setRecords(data)
        currenSlip.current = {
            ...data[0],
            generatedOn: formateDate(new Date)
        }
        setPage(1);
    }
    const handleChangePage = (event, value) => {
        const currentRec = records[value - 1];
        currenSlip.current = {
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
            <PayslipView key={currenSlip.current?.id} {...currenSlip.current} />
        </BaseReportWrapper>
    )
}

export default PaySlipViewer