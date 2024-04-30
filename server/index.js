const express = require('express')
const PORT = 5000
const app = express()

// Support JSON POSTs
const jsonParser = require('body-parser').json()

// Environment Variables
require('dotenv').config()

// Return the default API key.
app.get('/api/load-key', async (req, res) => {
    //#region Load the API key and company info

    const getStoreInfo = async (key) => {
        //#region Fetch the store info related to the given key
        const url = new URL("https://api.housecallpro.com/company")
        console.log(url.href)
        return new Promise((resolve, reject) => {
            fetch(url.href, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Authorization": `Token ${key}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
        })
        //#endregion
    }

    // Allow for > 1 key by splitting the env at ,
    const apiKeys = process.env.APIKEY.split(",")

    // Bucket to store each store's info
    let availableStores = []

    // Push all stores I have access to to availableStores
    for (let i = 0; i < apiKeys.length; i++) {
        const storeInfo = await getStoreInfo(apiKeys[i]);
        // Include the API key with the store data
        storeInfo.apiKey = apiKeys[i];
        availableStores.push(storeInfo)
    }

    // Resolve with all available store information
    res.json(availableStores)

    //#endregion
})

// Get the jobs
app.post('/api/get-jobs', jsonParser, async (req, res) => {
    //#region Load jobs from Housecall API

    const params = { ...req.body };
    let jobData = []

    console.log(params)

    const loadJobs = (pageNum, url) => {
        //#region Load Jobs Routine
        url.searchParams.delete("page")
        url.searchParams.append("page", pageNum)
        return new Promise((resolve, reject) => {
            console.log("Getting ", url.href)
            // Get the jobs between the dats
            let getParams = {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Authorization": `Token ${params.apiKey}`
                }
            }
            console.log("Params:", getParams)
            fetch(url.href, getParams).then((response) => response.json())
                .then((data) => {
                    console.log("Resolving loadJobs")
                    resolve(data)
                }).catch((err) => {
                    reject(err)
                })
        })
        //#endregion
    }

    // Build URL to get data from API
    const url = new URL("https://api.housecallpro.com/jobs");
    url.searchParams.append("scheduled_start_min", params.startDate)
    url.searchParams.append("scheduled_start_max", params.endDate)
    url.searchParams.append("work_status[]", "completed")
    url.searchParams.append("page_size", "100")
    console.log(url)

    // Get the jobs between the dates
    // Get the first page of data
    let startPage = 1;
    let startData = await loadJobs(startPage, url);
    // console.log(startData)
    // Add first page's jobs to collection
    jobData = jobData.concat(startData.jobs)
    // If there are more than 1 page of data needed
    if (startData.total_pages > 1) {
        console.log("There's more data.")
        // While startPage counter is < the total number of pages
        while (startPage < startData.total_pages) {
            // Increment startPage counter
            startPage++
            // Get the next page of data.
            let newData = await loadJobs(startPage, url)
            // Add the jobs to the job collection
            jobData = jobData.concat(newData.jobs)
        }
        res.json(jobData)
        return;
    }

    console.log("Done retrieving data for ", params)
    res.json(jobData)
    //#endregion
})

app.post('/api/get-customer-addr', jsonParser, async (req, res) => {
    //#region Get Customer Address

    let cusId = req.body.customer
    let addrs = []

    // Build URL to get data from API
    let url = new URL(`https://api.housecallpro.com/customers/${cusId}/addresses`);

    // console.log(`Getting customer ${cusId} at url ${url}`)

    let cusResponse = await fetch(url.href, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Authorization": `Token ${req.body.apiKey}`
        }
    })

    let cust = await cusResponse.json();

    addrs = addrs.concat(cust.addresses)

    res.json(addrs)

    //#endregion
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

/* TRASH CAN
//#region TRASH
// app.post('/api/get-customers', jsonParser, async (req, res) => {

//     // Build URL to get data from API
//     const url = new URL("https://api.housecallpro.com/customers?location_ids=cus_4b5960e6062f4aad8ebb695865737654&location_ids=cus_4b5960e6062f4aad8ebb695865737654")

//     let packet = {
//         "method": "GET",
//         "headers": {
//             "Accept": "application/json",
//             "Authorization": `Token ${req.body.apiKey}`
//         },
//     }
//     console.log(packet)
//     let customersResponse = await fetch(url.href, packet)
//     let customers = await customersResponse.json();
//     res.json(customers)

// })
//#endregion
*/
