import { useState, useEffect } from 'react'

// import Navbar from 'react-bootstrap/Navbar'
// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
// import InputGroup from 'react-bootstrap/InputGroup'
// import Dropdown from 'react-bootstrap/Dropdown'

import Table from './components/Table'
import Papa from 'papaparse'


import './App.css'

function App() {

    //#region STATE
    const [tableData, setTableData] = useState([])
    const thisYear = new Date().getFullYear()
    const [apiKey, setApiKey] = useState(``)
    const [currentStore, setCurrentStore] = useState({})
    const [startDate, setStartDate] = useState(`${thisYear}-01-01`)
    const [endDate, setEndDate] = useState(`${thisYear}-02-01`)
    const [storeData, setStoreData] = useState([]);
    //#endregion

    useEffect(() => {
        //#region ON LOAD
        fetch('/api/load-key').then((response) => response.json())
            .then((response) => {
                console.log(response)
                setStoreData(response)
                setCurrentStore(response[0])
            })
        //#endregion
    }, [])

    const handleSubmit = async (e) => {
        //#region User clicks "Get"
        e.preventDefault();

        console.log("Store key:", e.target)

        // Packet to send to API
        let body = JSON.stringify({
            apiKey: currentStore.apiKey,
            startDate: startDate,
            endDate: endDate
        })

        //Get all of the jobs between startDate and endDate
        const jobsResponse = await fetch('/api/get-jobs', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            body
        })
        const jobs = await jobsResponse.json();
        console.log(jobs)
        const newTableData = [];

        for (const job of jobs) {

            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////// CUSTOMERS ///////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////

            // console.log(`Getting customer ${job.customer.id}...`)
            // // Let's look at all of a customer's addresses
            // const customerAddrResponse = await fetch('/api/get-customer-addr', {
            //     "method": "POST",
            //     "headers": {
            //         "Content-Type": "application/json"
            //     },
            //     "body": JSON.stringify({
            //         customer: job.customer.id,
            //         apiKey: currentStore.apiKey
            //     })
            // })

            // Max 10 customer addresses
            //
            ////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////; ////////
            ////////////////////////////////////////////////////////////////////////////////

            let newTableObj = {
                "jobId": job.id,
                "addressId": job.address.id,
                "customerId": job.customer.id,
                "tags": job.customer.tags.length > 0 ? job.customer.tags.join(", ") : "",
                "address_street": job.address.street,
                "address_street_line_2": job.address.street_line_2,
                "address_city": job.address.city,
                "address_state": job.address.state,
                "address_zip": job.address.zip,
                "address_type": job.address.type,
                "description": job.description,
                "notes_content": job.notes.content,
                // "number_of_addresses": customerAddrs.length,
                // "address_types": customerAddrs.map((addr) => addr.type).join(", "),
                "work_completed_at": job.work_timestamps.completed_at,
                "customer_first_name": job.customer.first_name,
                "customer_last_name": job.customer.last_name,
                "customer_email": job.customer.email,
                "customer_tags": job.customer.tags.join(", "),
                "job_type": job.job_fields.job_type ? job.job_fields.job_type.name : "",
                "work_status": job.work_status,
                "total_amount": job.total_amount * 0.01 // Cents to Dollar
            }

            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////// CUSTOMERS ///////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////

            // console.log(customerAddrs)

            // for (var i = 0; i < 10; i++) {
            //     newTableObj[`customer_street_${i + 1}`] = ""
            //     newTableObj[`customer_street_line_2_${i + 1}`] = ""
            //     newTableObj[`customer_city_${i + 1}`] = ""
            //     newTableObj[`customer_state_${i + 1}`] = ""
            //     newTableObj[`customer_zip_${i + 1}`] = ""
            //     newTableObj[`customer_type_${i + 1}`] = ""
            // }
            // for (var n = 0; n < customerAddrs.length; n++) {
            //     newTableObj[`customer_street_${n + 1}`] = customerAddrs[n].street;
            //     newTableObj[`customer_street_line_2_${n + 1}`] = customerAddrs[n].street_line_2;
            //     newTableObj[`customer_city_${n + 1}`] = customerAddrs[n].city
            //     newTableObj[`customer_state_${n + 1}`] = customerAddrs[n].state
            //     newTableObj[`customer_zip_${n + 1}`] = customerAddrs[n].zip
            //     newTableObj[`customer_type_${n + 1}`] = customerAddrs[n].type
            // }

            ////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////; ////////
            ////////////////////////////////////////////////////////////////////////////////

            newTableData.push(newTableObj)

        }
        setTableData(newTableData)
        console.log(`All "completed" jobs between ${startDate} and ${endDate}: `, tableData)


        //#endregion
    }

    const handleStoreChange = (e) => {
        //#region User changes the store
        const storeId = e.target[e.target.selectedIndex]
            .getAttribute("storeid")

        console.log("New id:", storeId)

        // Update the current store
        const newStore = storeData.filter((store) => {
            return store.id === storeId
        })[0]
        console.log("Changing to:", newStore)
        setCurrentStore(newStore)
        //#endregion
    }

    // Exports the table data to a CSV file
    const exportTable = (array) => {
        // #region Export table data to CSV 
        console.log("Exporting ", array)

        // Download the CSV data
        const downloadCSVFile = (data) => {
            const elem = document.createElement("a");
            const file = new Blob([data], { type: 'text/plain' });
            elem.href = URL.createObjectURL(file);
            elem.download = "tableData.csv"
            document.body.appendChild(elem)
            elem.click();
        }

        // PapaParse convert JSON to CSV
        const csv = Papa.unparse(array);
        downloadCSVFile(csv);

        // #endregion 
    }

    return (
        <>
            <div id="controls">
                <div className="control">
                    <select id="choose-store" onChange={handleStoreChange}>
                        {storeData.map((store, key) => {
                            return <option key={key} storeid={store.id}>{store.name}</option>
                        })}
                    </select>
                </div>
                <div className="control">
                    <label htmlFor="start-date">Start Date</label>
                    <input id="start-date" type="date" value={startDate} onChange={(e) => setstartDate(e.target.value)} />
                </div>
                <div className="control">
                    <label htmlFor="end-date">Start Date</label>
                    <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="control">
                    <button onClick={handleSubmit}>Get</button>
                </div>
            </div>
            <div id="storedata" dangerouslySetInnerHTML={{ __html: `<pre>${syntaxHighlight(currentStore)}</pre>` }}>
            </div>
            <button onClick={() => exportTable(tableData)}>Export</button>
            <div id="table">
                <Table tableData={tableData} />
            </div>
        </>
    )
}

// https://codepen.io/absolutedevelopment/pen/EpwVzN
function syntaxHighlight(json) {
    try {

        //#region JSON Syntax Highlighter
        if (typeof json != "string") {
            json = JSON.stringify(json, null, "\t");
        }

        json = json
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function(match) {
                var cls = "number";
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = "key";
                    } else {
                        cls = "string";
                    }
                } else if (/true|false/.test(match)) {
                    cls = "boolean";
                } else if (/null/.test(match)) {
                    cls = "null";
                }
                return '<span class="' + cls + '">' + match + "</span>";
            }
        );
    } catch (e) {
        return `<b>There was an issue:</b><pre>${e}</pre>`
    }
    //#endregion
}

export default App
