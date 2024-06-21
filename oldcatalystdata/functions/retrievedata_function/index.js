"use strict";
var request = require("request");
const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const app = express();
app.use(express.json());
let config = {
  search: "Iddetails",
  search_table_columns: {
    Signzykey: ["signzydata"],
  },
};
const Signzykey = //{Your Table name}; Replace your table name
  app.post("/datacheck", async (req, res) => {
    const extension_name = req.body.extension;
    const customer_id = req.body.customers_id;
    const product = req.body.product_name;
    const pemailid = req.body.pemailid;
    const semailid = req.body.Semailid;
    const apilim= req.body.apilimit;
	
	console.log("apilim ",apilim);
    const subscriptionType = req.body.subscriptionType;
    const redirectUrlValue = req.body.redirectURL;
    var today = new Date();
    console.log("actualdate", today);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    const today11 = yyyy + "-" + mm + "-" + dd;
    const dateandtime =
      today11 +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    console.log(today11);
    console.log(dateandtime);
    const tomorrow = new Date();

   


    if (subscriptionType === "Paid") {

      if (typeof apilim !== 'undefined') {
        var apicount=apilim
        console.log("APItotl ",apicount);
        
        }
        else if (extension_name === "GSTIN Validation for Zoho CRM") {
          var apicount = 500;
        } 
        else{
        var apicount=1000
        }

      tomorrow.setDate(today.getDate() + 30);
      // if (extension_name === "GSTIN Validation for Zoho CRM") {
      //   var apicount = 500;
      // } 
      // else {
      //   var apicount = 1000;
      // }

      
      var subtype = true;
    } else if (subscriptionType === "Trail") {
      tomorrow.setDate(today.getDate() + 10);
      var apicount = 20;
      var subtype = false;
    } else if (subscriptionType === "Uninstall") {
      tomorrow.setDate(today.getDate());
      var subtype = false;
      var apicount = 0;
    }
    console.log("subscription_type", subscriptionType);
    console.log("tomorrow", tomorrow);
    var dd = String(tomorrow.getDate()).padStart(2, "0");
    var mm = String(tomorrow.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = tomorrow.getFullYear();
    const quotaenddate = yyyy + "-" + mm + "-" + dd;
    console.log("quotaenddate", quotaenddate);
    let config2 = {
      search: customer_id,
      search_table_columns: {
        Customerdetails: ["Customerid"],
      },
    };
    console.log(config2);
    var catalystApp = catalyst.initialize(req);
    let datastore = catalystApp.datastore();
    let search = catalystApp.search();
    let searchPromise2 = search.executeSearchQuery(config2);
    searchPromise2.then((searchResult) => {
      let actualdata2 = JSON.stringify(searchResult);
      let actualdata3 = JSON.parse(actualdata2);
      // console.log(actualdata3.Customerdetails);
      let customer_details = actualdata3.Customerdetails;
      console.log("the value of customerdetails===", customer_details);
      if (customer_details == undefined) {
        let insertdata = {
          Productname: product,
          Customerid: customer_id,
          ZohoExtensionName: extension_name,
          Pemailid: pemailid,
          Semailid: semailid,
          Quota: apicount,
          usedquota: 0,
          remainingbalance: apicount,
          quota_startdate: today11,
          quota_enddate: quotaenddate,
          subscription: subscriptionType,
          redirectUrl: redirectUrlValue,
        };
        let table = datastore.table("Customerdetails");
        let insertPromise = table.insertRow(insertdata);
        insertPromise
          .then((row) => {
            let bushan = {
              sucess_message: "The records are created sucessfully",
              row,
            };
            res.status(200).send(bushan);
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
        console.log("created");
      } else if (customer_details != undefined) {
        let rowidtoupdate = customer_details[0].ROWID;
        let updatedata = {
          Productname: product,
          Customerid: customer_id,
          ZohoExtensionName: extension_name,
          Pemailid: pemailid,
          Semailid: semailid,
          Quota: apicount,
          usedquota: 0,
          remainingbalance: apicount,
          quota_startdate: today11,
          quota_enddate: quotaenddate,
          subscription: subscriptionType,
          redirectUrl: redirectUrlValue,
          ROWID: rowidtoupdate,
        };
        console.log(updatedata);
        let table3 = datastore.table("Customerdetails");
        let rowPromise = table3.updateRow(updatedata);
        rowPromise
          .then((row) => {
            let shashee = {
              sucess_message: "The records are modified sucessfully",
              row,
            };
            res.status(200).send(shashee);
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
        console.log("updated");
      }
    });
  });
app.post("/getpan", async (req, res) => {
  const pan_number = req.body.pan_number;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  console.log(today11);
  console.log(dateandtime);
  var catalystApp = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    console.log(zcsearchvalue[0]);
    // console.log(queryResult[0].Customerdetails);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      // let datastore = catalystApp.datastore();
      let search = catalystApp.search();
      let datastore = catalystApp.datastore();
      let rowidupdatevalue = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetPAN_Details",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123
          .then((row) => {
            let updatedsucessdata33 = {
              sucess_message: "The records are created sucessfully",
              row,
            };
            let usedcountofapi = parseInt(usedapiquota) + 1;
            let sucessapiupdate = {
              usedquota: usedcountofapi,
              remainingbalance:
                parseInt(availableapi) - parseInt(usedcountofapi),
              ROWID: rowidupdatevalue,
            };
            console.log(sucessapiupdate);
            let table77 = datastore.table("Customerdetails");
            let rowPromise = table77.updateRow(sucessapiupdate);
            rowPromise
              .then((row) => {
                let updatedsucessdata = {
                  sucess_message: "The records are modified sucessfully",
                  row,
                };
                if (row != undefined) {
                  let searchPromise = search.executeSearchQuery(config);
                  searchPromise.then((searchResult) => {
                    let actualdata = JSON.stringify(searchResult);
                    let actualdata1 = JSON.parse(actualdata);
                    let asa = actualdata1["Signzykey"];
                    let id_of_user = asa[0].id;
                    let user_id1 = asa[0].User_ID;
                    const options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id1 +
                        "/identities",
                      headers: {
                        "Accept-Language": "en-US,en;q=0.8",
                        "content-type": "application/json",
                        Accept: "*/*",
                        Authorization: id_of_user,
                      },
                      body: {
                        type: "individualPan",
                        callbackUrl: "https://www.google.com",
                        email: "support.extensions@nexivo.co",
                        images: [],
                      },
                      json: true,
                    };

                    request(options, function (error, response, body) {
                      let accesstoken = body.accessToken;
                      let id = body.id;
                      let patronid = body.patronId;
                      console.log(aadhar_number);
                      const options2 = {
                        method: "POST",
                        url: "https://signzy.tech/api/v2/snoops",
                        headers: {
                          "Accept-Language": "en-US,en;q=0.8",
                          "content-type": "application/json",
                          Accept: "*/*",
                        },
                        body: {
                          service: "Identity",
                          itemId: id,
                          accessToken: accesstoken,
                          task: "fetch",
                          essentials: { number: pan_number },
                        },
                        json: true,
                      };
                      request(options2, function (error, response, body) {
                        if (error) throw new Error(error);
                        const gstinresponse = {
                          response: body,
                          Remaining_balance: remainingapi-1,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                       res.status(200).send(gstinresponse);
                        
                      });
                    });
                  });
                } else {
                  res.status(500).send({
                    error: {
                      code: 143,
                      message: "database is not in service",
                    },
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                res.status(500).send(e);
              });
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/verifyDL", async (req, res) => {
  const driving_licence = req.body.drivinglicence;
  const DOB = req.body.dob;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var catalystApp1 = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp1.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    console.log(zcsearchvalue[0]);
    // console.log(queryResult[0].Customerdetails);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      // let datastore = catalystApp.datastore();
      let search1 = catalystApp1.search();
      let datastore = catalystApp1.datastore();
      let rowidupdatevalue1 = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue1);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "Get_DrivingL_details",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        // console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123.then((row) => {
          let updatedsucessdata33 = {
            sucess_message: "The records are created sucessfully",
            row,
          };
          let usedcountofapi = parseInt(usedapiquota) + 1;
          let sucessapiupdate1 = {
            usedquota: usedcountofapi,
            remainingbalance: parseInt(availableapi) - parseInt(usedcountofapi),
            ROWID: rowidupdatevalue1,
          };
          let table777 = datastore.table("Customerdetails");
          let rowPromise = table777.updateRow(sucessapiupdate1);
          rowPromise
            .then((row) => {
              let updatedsucessdata1 = {
                sucess_message: "The records are created sucessfully",
                row,
              };
              if (row != undefined) {
                let searchPromise1 = search1.executeSearchQuery(config);
                searchPromise1
                  .then((searchResult) => {
                    let actualdata44 = JSON.stringify(searchResult);
                    let actualdata55 = JSON.parse(actualdata44);
                    let asa1 = actualdata55["Signzykey"];
                    let id_of_user1 = asa1[0].id;
                    let user_id2 = asa1[0].User_ID;
                    const options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id2 +
                        "/identities",
                      headers: {
                        "Accept-Language": "en-US,en;q=0.8",
                        "content-type": "application/json",
                        Accept: "*/*",
                        Authorization: id_of_user1,
                      },
                      body: {
                        type: "drivingLicence",
                        callbackUrl: "https://www.google.com",
                        email: "support.extensions@nexivo.co",
                        images: [],
                      },
                      json: true,
                    };

                    request(options, function (error, response, body) {
                      let accesstoken1 = body.accessToken;
                      let id1 = body.id;
                      let patronid1 = body.patronId;
                      const options2 = {
                        method: "POST",
                        url: "https://signzy.tech/api/v2/snoops",
                        headers: {
                          "Accept-Language": "en-US,en;q=0.8",
                          "content-type": "application/json",
                          Accept: "*/*",
                        },
                        body: {
                          service: "Identity",
                          itemId: id1,
                          accessToken: accesstoken1,
                          task: "verification",
                          essentials: { number: driving_licence, dob: DOB },
                        },
                        json: true,
                      };
                      request(options2, function (error, response, body) {
                        if (error) throw new Error(error);
                        const gstinresponse = {
                          response: body,
                          Remaining_balance: remainingapi-1,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                        res.status(200).send(gstinresponse);
                        //return res.send(body);
                      });
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              } else {
                res.status(500).send({
                  error: {
                    code: 143,
                    message: "database is not in service",
                  },
                });
              }
            })
            .catch((e) => {
              console.log(e);
              res.status(500).send(e);
            });
        });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/getGST", async (req, res) => {
  const gst_number = req.body.Gstnumber;
  const extension_name = req.body.Extension;
  const clientid = req.body.clientId;
  const pemailid = req.body.Pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var catalystApp1 = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp1.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    // console.log(zcsearchvalue[0]);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      let search1 = catalystApp1.search();
      let datastore = catalystApp1.datastore();
      let rowidupdatevalue1 = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue1);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetGstinDetails",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        // console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123.then((row) => {
          let updatedsucessdata33 = {
            sucess_message: "The records are created sucessfully",
            row,
          };
          let usedcountofapi = parseInt(usedapiquota) + 1;
          let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);
          let sucessapiupdate1 = {
            usedquota: usedcountofapi,
            remainingbalance: parseInt(availableapi) - parseInt(usedcountofapi),
            ROWID: rowidupdatevalue1,
          };
          let table777 = datastore.table("Customerdetails");
          let rowPromise = table777.updateRow(sucessapiupdate1);
          rowPromise
            .then((row) => {
              let updatedsucessdata1 = {
                sucess_message: "The records are created sucessfully",
                row,
              };
              if (row != undefined) {
                let searchPromise1 = search1.executeSearchQuery(config);
                searchPromise1
                  .then((searchResult) => {
                    let actualdata44 = JSON.stringify(searchResult);
                    let actualdata55 = JSON.parse(actualdata44);
                    let asa1 = actualdata55["Signzykey"];
                    let id_of_user1 = asa1[0].id;
                    let user_id2 = asa1[0].User_ID;
                    var options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id2 +
                        "/gstns",
                      headers: {
                        Accept: "*/*",
                        "Accept-Language": "en-US,en;q=0.8",
                        Authorization: id_of_user1,
                        "content-type": "application/json",
                      },
                      body: {
                        task: "gstinSearch",
                        essentials: {
                          gstin: gst_number,
                        },
                      },
                      json: true,
                    };
                    request(options, function (error, response) {
                      if (error) throw new Error(error);
                      const responseofgst = response.body;
                      const bodyresult = responseofgst.result;
                      // console.log(bodyresult);
                      if (bodyresult != undefined) {
                        const gstindetailed = bodyresult.gstnDetailed;
                        const constbusiness =
                          gstindetailed.constitutionOfBusiness;
                        const legalbusiness = gstindetailed.legalNameOfBusiness;
                        const taxpayer = gstindetailed.taxPayerType;
                        const gststatus = gstindetailed.gstinStatus;
                        const registrationDate1 =
                          gstindetailed.registrationDate;
                        const additionaladdreess1 =
                          gstindetailed.additionalAddressArray;
                        const principalPlaceSplitAddress1 =
                          gstindetailed.principalPlaceSplitAddress;
                        const gstinresponse = {
                          constitutionOfBusiness: constbusiness,
                          legalNameOfBusiness: legalbusiness,
                          taxPayerType: taxpayer,
                          gstinStatus: gststatus,
                          registrationDate: registrationDate1,
                          additionalAddressArray: additionaladdreess1,
                          principalPlaceSplitAddress:
                            principalPlaceSplitAddress1,
                          Remaining_balance: remainbalance,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                        res.status(200).send(gstinresponse);
                      } else {
                        res.status(500).send({
                          error: {
                            code: 777,
                            message: "Please Provide correct Gstin Number",
                          },
                        });
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              } else {
                res.status(500).send({
                  error: {
                    code: 143,
                    message: "database is not in service",
                  },
                });
              }
            })
            .catch((e) => {
              console.log(e);
              res.status(500).send(e);
            });
        });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/getBusinesspan", async (req, res) => {
  const business_pan_number = req.body.businesspan_number;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  console.log(today11);
  console.log(dateandtime);
  var catalystApp = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    console.log(zcsearchvalue[0]);
    // console.log(queryResult[0].Customerdetails);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      // let datastore = catalystApp.datastore();
      let search = catalystApp.search();
      let datastore = catalystApp.datastore();
      let rowidupdatevalue = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetPAN_Details",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123
          .then((row) => {
            let updatedsucessdata33 = {
              sucess_message: "The records are created sucessfully",
              row,
            };
            let usedcountofapi = parseInt(usedapiquota) + 1;
            let sucessapiupdate = {
              usedquota: usedcountofapi,
              remainingbalance:
                parseInt(availableapi) - parseInt(usedcountofapi),
              ROWID: rowidupdatevalue,
            };
            console.log(sucessapiupdate);
            let table77 = datastore.table("Customerdetails");
            let rowPromise = table77.updateRow(sucessapiupdate);
            rowPromise
              .then((row) => {
                let updatedsucessdata = {
                  sucess_message: "The records are modified sucessfully",
                  row,
                };
                if (row != undefined) {
                  let searchPromise = search.executeSearchQuery(config);
                  searchPromise.then((searchResult) => {
                    let actualdata = JSON.stringify(searchResult);
                    let actualdata1 = JSON.parse(actualdata);
                    let asa = actualdata1["Signzykey"];
                    let id_of_user = asa[0].id;
                    let user_id1 = asa[0].User_ID;
                    const options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id1 +
                        "/identities",
                      headers: {
                        "Accept-Language": "en-US,en;q=0.8",
                        "content-type": "application/json",
                        Accept: "*/*",
                        Authorization: id_of_user,
                      },
                      body: {
                        type: "businessPan",
                        callbackUrl: "https://www.google.com",
                        email: "support.extensions@nexivo.co",
                        images: [],
                      },
                      json: true,
                    };

                    request(options, function (error, response, body) {
                      let accesstoken = body.accessToken;
                      let id = body.id;
                      let patronid = body.patronId;
                      const options2 = {
                        method: "POST",
                        url: "https://signzy.tech/api/v2/snoops",
                        headers: {
                          "Accept-Language": "en-US,en;q=0.8",
                          "content-type": "application/json",
                          Accept: "*/*",
                        },
                        body: {
                          service: "Identity",
                          itemId: id,
                          accessToken: accesstoken,
                          task: "fetch",
                          essentials: { number: business_pan_number },
                        },
                        json: true,
                      };
                      request(options2, function (error, response, body) {
                        if (error) throw new Error(error);
                        return res.send({
                          Remaining_balance: remainingapi,
                          Actual_quota: availableapi,
                          Used_quota: usedapiquota,
                          body,
                        });
                      });
                    });
                  });
                } else {
                  res.status(500).send({
                    error: {
                      code: 143,
                      message: "database is not in service",
                    },
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                res.status(500).send(e);
              });
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/getpannew", async (req, res) => {
  const aadhar_number = req.body.pan_number;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  console.log(today11);
  console.log(dateandtime);
  var catalystApp = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
    //console.log(query);
  let zcql = catalystApp.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
  //  console.log(zcsearchvalue[0]);
  //   // console.log(queryResult[0].Customerdetails);
    if (zcsearchvalue[0] != undefined) {
      console.log("nnmm")
       console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      // return res.send(zcsearchvalue[0].Customerdetails.remainingbalance)
      // let datastore = catalystApp.datastore();
      let search = catalystApp.search();
      let datastore = catalystApp.datastore();
      let rowidupdatevalue = zcsearchvalue[0].Customerdetails.ROWID;
      var availableapi = zcsearchvalue[0].Customerdetails.Quota;
      var remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      var usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetPAN_Details",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123
          .then((row) => {
            let updatedsucessdata33 = {
              sucess_message: "The records are created sucessfully",
              row,
            };
            // return res.send(insertPromise123)
 
            let usedcountofapi = parseInt(usedapiquota) + 1;
            let sucessapiupdate = {
              usedquota: usedcountofapi,
              remainingbalance:
                parseInt(availableapi) - parseInt(usedcountofapi),
              ROWID: rowidupdatevalue,
            };
            console.log("usedcountofapi",usedcountofapi);
            console.log("remainingapi",sucessapiupdate.remainingbalance);
            console.log("availableapi",availableapi);
            let table77 = datastore.table("Customerdetails");
            let rowPromise = table77.updateRow(sucessapiupdate);
            rowPromise
              .then((row) => {
                let updatedsucessdata = {
                  sucess_message: "The records are modified sucessfully",
                  row,
                };
                if (row != undefined) {
                  let searchPromise = search.executeSearchQuery(config);
                  searchPromise.then((searchResult) => {
                    let actualdata = JSON.stringify(searchResult);
                    let actualdata1 = JSON.parse(actualdata);
                    let asa = actualdata1["Signzykey"];
                    let id_of_user = asa[0].id;
                    let user_id1 = asa[0].User_ID;
                   
                    const options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id1 +
                        "/identities",
                      headers: {
                        "Accept-Language": "en-US,en;q=0.8",
                        "content-type": "application/json",
                        Accept: "*/*",
                        Authorization: id_of_user,
                      },
                      body: {
                        type: "individualPan",
                        callbackUrl: "https://www.google.com",
                        email: "support.extensions@nexivo.co",
                        images: [],
                      },
                      json: true,
                    };

                    request(options, function (error, response, body) {
                      let accesstoken = body.accessToken;
                      let id = body.id;
                      let patronid = body.patronId;
                      console.log(aadhar_number);
                    
                      const options2 = {
                        method: "POST",
                        url: "https://signzy.tech/api/v2/snoops",
                        headers: {
                          "Accept-Language": "en-US,en;q=0.8",
                          "content-type": "application/json",
                          Accept: "*/*",
                        },
                        body: {
                          service: "Identity",
                          itemId: id,
                          accessToken: accesstoken,
                          task: "fetch",
                          essentials: { number: aadhar_number },
                        },
                        json: true,
                      };
                      request(options2, function (error, response, body) {
                        if (error) throw new Error(error);
                        // console.log("remainbalance ",remainbalance);
                        // console.log("availableapi ",availableapi);
                       //  console.log(aadhar_number);
                        const gstinresponse = {
                          response: body,
                          Remaining_balance: remainingapi-1,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                      //  console.log("gstinresponse ",gstinresponse);
                        res.status(200).send(gstinresponse);
                      });
                    });
                  });
                } else {
                  res.status(500).send({
                    error: {
                      code: 143,
                      message: "database is not in service",
                    },
                  });
                }
              })
              .catch((e) => {
                console.log(e);
                res.status(500).send(e);
              });
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send(e);
          });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
       }
    } else {
  //     res.status(500).send({
  //       error: {
  //         code: 133,
  //         message: "The disposed clientid is invalid",
  //       },
  //     });
     }
  });


});
app.post("/PFDetatils", async (req, res) => {
  const EstsblishmentId = req.body.EstablishmentId;
  const EstablishmentName = req.body.EstablishmentName;
  const EmployeeName = req.body.EmployeeName;
  const EmploymentMonth = req.body.EmploymentMonth;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var catalystApp1 = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp1.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    // console.log(zcsearchvalue[0]);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      let search1 = catalystApp1.search();
      let datastore = catalystApp1.datastore();
      let rowidupdatevalue1 = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue1);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetGstinDetails",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        // console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123.then((row) => {
          let updatedsucessdata33 = {
            sucess_message: "The records are created sucessfully",
            row,
          };
          let usedcountofapi = parseInt(usedapiquota) + 1;
          let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);
          let sucessapiupdate1 = {
            usedquota: usedcountofapi,
            remainingbalance: parseInt(availableapi) - parseInt(usedcountofapi),
            ROWID: rowidupdatevalue1,
          };
          let table777 = datastore.table("Customerdetails");
          let rowPromise = table777.updateRow(sucessapiupdate1);
          rowPromise
            .then((row) => {
              let updatedsucessdata1 = {
                sucess_message: "The records are created sucessfully",
                row,
              };
              if (row != undefined) {
                let searchPromise1 = search1.executeSearchQuery(config);
                searchPromise1
                  .then((searchResult) => {
                    let actualdata44 = JSON.stringify(searchResult);
                    let actualdata55 = JSON.parse(actualdata44);
                    let asa1 = actualdata55["Signzykey"];
                    let id_of_user1 = asa1[0].id;
                    let user_id2 = asa1[0].User_ID;
                    var options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id2 +
                        "/epfos",
                      headers: {
                        Accept: "*/*",
                        "Accept-Language": "en-US,en;q=0.8",
                        Authorization: id_of_user1,
                        "content-type": "application/json",
                      },
                      body: {
                        task: "employeeNameSearchv2",
                        essentials: {
                          establishmentId: EstsblishmentId,
                          establishmentName: EstablishmentName,
                          employeeName: EmployeeName,
                          employmentMonth: EmploymentMonth,
                        },
                      },
                      json: true,
                    };
                    request(options, function (error, response) {
                      if (error) throw new Error(error);
                      const responseofgst = response.body;
                      const bodyresult1 = responseofgst.result;
                      // console.log(bodyresult1);
                      if (bodyresult1 != undefined) {
                        const pfvalue = bodyresult1;
                        console.log(pfvalue.searchResult);
                        const resultpfvalue = pfvalue.searchResult;
                        const gstinresponse = {
                          response: resultpfvalue,
                          Remaining_balance: remainbalance,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                        res.status(200).send(gstinresponse);
                      } else {
                        res.status(500).send({
                          error: {
                            code: 777,
                            message: "Please Provide the correct PF details",
                          },
                        });
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              } else {
                res.status(500).send({
                  error: {
                    code: 143,
                    message: "database is not in service",
                  },
                });
              }
            })
            .catch((e) => {
              console.log(e);
              res.status(500).send(e);
            });
        });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/UAN", async (req, res) => {
  const uan = req.body.uan;
  const password1 = req.body.password;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var catalystApp1 = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp1.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    // console.log(zcsearchvalue[0]);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      let search1 = catalystApp1.search();
      let datastore = catalystApp1.datastore();
      let rowidupdatevalue1 = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue1);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetGstinDetails",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        // console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123.then((row) => {
          let updatedsucessdata33 = {
            sucess_message: "The records are created sucessfully",
            row,
          };
          let usedcountofapi = parseInt(usedapiquota) + 1;
          let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);
          let sucessapiupdate1 = {
            usedquota: usedcountofapi,
            remainingbalance: parseInt(availableapi) - parseInt(usedcountofapi),
            ROWID: rowidupdatevalue1,
          };
          let table777 = datastore.table("Customerdetails");
          let rowPromise = table777.updateRow(sucessapiupdate1);
          rowPromise
            .then((row) => {
              let updatedsucessdata1 = {
                sucess_message: "The records are created sucessfully",
                row,
              };
              if (row != undefined) {
                let searchPromise1 = search1.executeSearchQuery(config);
                searchPromise1
                  .then((searchResult) => {
                    let actualdata44 = JSON.stringify(searchResult);
                    let actualdata55 = JSON.parse(actualdata44);
                    let asa1 = actualdata55["Signzykey"];
                    let id_of_user1 = asa1[0].id;
                    let user_id2 = asa1[0].User_ID;
                    var options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id2 +
                        "/epfos",
                      headers: {
                        Accept: "*/*",
                        "Accept-Language": "en-US,en;q=0.8",
                        Authorization: id_of_user1,
                        "content-type": "application/json",
                      },
                      body: {
                        task: "uanDetailed",
                        essentials: {
                          uan: uan,
                          password: password1,
                        },
                      },
                      json: true,
                    };
                    request(options, function (error, response) {
                      if (error) throw new Error(error);
                      const uanresult = response.body;
                      // const bodyresult1 = responseofgst.result;
                      // console.log(bodyresult1);
                      if (uanresult != undefined) {
                        const pfvalue = uanresult;
                        const gstinresponse = {
                          response: uanresult,
                          Remaining_balance: remainbalance,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                        res.status(200).send(gstinresponse);
                      } else {
                        res.status(500).send({
                          error: {
                            code: 777,
                            message: "Please Provide the correct UAN details",
                          },
                        });
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              } else {
                res.status(500).send({
                  error: {
                    code: 143,
                    message: "database is not in service",
                  },
                });
              }
            })
            .catch((e) => {
              console.log(e);
              res.status(500).send(e);
            });
        });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
app.post("/Bankcheck", async (req, res) => {
  const baccount = req.body.beneficiaryAccount;
  const bmobile = req.body.beneficiaryMobile;
  const bname = req.body.beneficiaryName;
  const bifsc = req.body.beneficiaryIFSC;
  const extension_name = req.body.extension;
  const clientid = req.body.clientid;
  const pemailid = req.body.pemailid;
  const semailid = req.body.Semailid;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  const today11 = yyyy + "-" + mm + "-" + dd;
  const dateandtime =
    today11 +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  var catalystApp1 = catalyst.initialize(req);
  let query =
    "SELECT Quota,usedquota,remainingbalance,ROWID FROM Customerdetails WHERE Customerid =" +
    clientid;
  let zcql = catalystApp1.zcql();
  let zcqlPromise = zcql.executeZCQLQuery(query);
  zcqlPromise.then((queryResult) => {
    let zcsearchvalue = queryResult;
    // console.log(zcsearchvalue[0]);
    if (zcsearchvalue[0] != undefined) {
      console.log(zcsearchvalue[0].Customerdetails.remainingbalance);
      let search1 = catalystApp1.search();
      let datastore = catalystApp1.datastore();
      let rowidupdatevalue1 = zcsearchvalue[0].Customerdetails.ROWID;
      let availableapi = zcsearchvalue[0].Customerdetails.Quota;
      let remainingapi = zcsearchvalue[0].Customerdetails.remainingbalance;
      let usedapiquota = zcsearchvalue[0].Customerdetails.usedquota;
      console.log("remaining balance", remainingapi);
      console.log("used api", usedapiquota);
      console.log("rowid", rowidupdatevalue1);
      if (remainingapi > 0) {
        let insertlog123 = {
          customerid: clientid,
          extension_name: extension_name,
          ApiName: "GetGstinDetails",
          APITimestamp: dateandtime,
          Pemail_id: pemailid,
          Semail_id: semailid,
        };
        // console.log(insertlog123);
        let table342 = datastore.table("logExtensions");
        let insertPromise123 = table342.insertRow(insertlog123);
        insertPromise123.then((row) => {
          let updatedsucessdata33 = {
            sucess_message: "The records are created sucessfully",
            row,
          };
          let usedcountofapi = parseInt(usedapiquota) + 1;
          let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);
          let sucessapiupdate1 = {
            usedquota: usedcountofapi,
            remainingbalance: parseInt(availableapi) - parseInt(usedcountofapi),
            ROWID: rowidupdatevalue1,
          };
          let table777 = datastore.table("Customerdetails");
          let rowPromise = table777.updateRow(sucessapiupdate1);
          rowPromise
            .then((row) => {
              let updatedsucessdata1 = {
                sucess_message: "The records are created sucessfully",
                row,
              };
              if (row != undefined) {
                let searchPromise1 = search1.executeSearchQuery(config);
                searchPromise1
                  .then((searchResult) => {
                    let actualdata44 = JSON.stringify(searchResult);
                    let actualdata55 = JSON.parse(actualdata44);
                    let asa1 = actualdata55["Signzykey"];
                    let id_of_user1 = asa1[0].id;
                    let user_id2 = asa1[0].User_ID;
                    var options = {
                      method: "POST",
                      url:
                        "https://signzy.tech/api/v2/patrons/" +
                        user_id2 +
                        "/bankaccountverifications",
                      headers: {
                        Accept: "*/*",
                        "Accept-Language": "en-US,en;q=0.8",
                        Authorization: id_of_user1,
                        "content-type": "application/json",
                      },
                      body: {
                        task: "bankTransfer",
                        essentials: {
                          beneficiaryMobile: bmobile,
                          beneficiaryAccount: baccount,
                          beneficiaryName: bname,
                          beneficiaryIFSC: bifsc,
                        },
                      },
                      json: true,
                    };
                    request(options, function (error, response) {
                      if (error) throw new Error(error);
                      const bankresponse = response.body;
                      // const bodyresult1 = responseofgst.result;
                      // console.log(bodyresult1);
                      if (bankresponse != undefined) {
                        const pfvalue = bankresponse;
                        const bankdetailsresp = {
                          response: bankresponse,
                          Remaining_balance: remainbalance,
                          Actual_quota: availableapi,
                          Used_quota: usedcountofapi,
                        };
                        res.status(200).send(bankdetailsresp);
                      } else {
                        res.status(500).send({
                          error: {
                            code: 777,
                            message: "Please Provide the correct Bank details",
                          },
                        });
                      }
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                    res.status(500).send(e);
                  });
              } else {
                res.status(500).send({
                  error: {
                    code: 143,
                    message: "database is not in service",
                  },
                });
              }
            })
            .catch((e) => {
              console.log(e);
              res.status(500).send(e);
            });
        });
      } else {
        res.status(500).send({
          error: {
            code: 234,
            message: "You have consumed 100% of api",
          },
        });
      }
    } else {
      res.status(500).send({
        error: {
          code: 133,
          message: "The disposed clientid is invalid",
        },
      });
    }
  });
});
module.exports = app;
