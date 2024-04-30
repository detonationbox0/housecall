import { ReactTabulator } from 'react-tabulator'
import './Table.css'
import './Tabulator.css'

const Table = ({ tableData }) => {

    const cols = [
        { field: "jobId", title: "Job ID" },
        { field: "addressId", title: "Address ID" },
        { field: "customerId", title: "Customer ID" },
        { field: "tags", title: "Tags" },
        { field: "address_street", title: "Address Street" },
        { field: "address_street_line_2", title: "Address Street Line 2" },
        { field: "address_city", title: "Address City" },
        { field: "address_state", title: "Address State" },
        { field: "address_zip", title: "Address Zip" },
        { field: "address_type", title: "Address Type" },
        { field: "description", title: "Description" },
        { field: "notes_content", title: "Notes content" },
        // { field: "number_of_addresses", title: "Number of Addresses" },
        // { field: "address_types", title: "Address Types" },
        { field: "work_completed_at", title: "Work Completed At" },
        { field: "customer_first_name", title: "Customer First Name" },
        { field: "customer_last_name", title: "Customer Last Name" },
        { field: "customer_email", title: "Customer Email" },
        { field: "customer_tags", title: "Customer Tags" },
        { field: "job_type", title: "Job Type" },
        { field: "work_status", title: "Work Status" },
        { field: "total_amount", title: "Total Amount" },
    ]

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// CUSTOMERS ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    // for (var i = 0; i < 10; i++) {
    //     cols.push([
    //         { field: `customer_street_${i + 1}`, title: `Customer Street` },
    //         { field: `customer_street_line_2_${i + 1}`, title: `Customer Street Line 2 ${i + 1}` },
    //         { field: `customer_city_${i + 1}`, title: `Customer City ${i + 1}` },
    //         { field: `customer_state_${i + 1}`, title: `Customer State ${i + 1}` },
    //         { field: `customer_zip_${i + 1}`, title: `Customer Zip ${i + 1}` },
    //         { field: `customer_type_${i + 1}`, title: `Customer Type ${i + 1}` },
    //     ])
    // }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// ; ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <ReactTabulator
                data={tableData}
                columns={cols}
                layout={'fitData'}
                height={'100%'}
                options={{
                    pagination: true,
                    paginationSize: 20
                }}
            />
        </>
    )

}

export default Table
