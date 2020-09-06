const log = console.log

export const addtime = (time, id) =>{
    const url = "/MapList/" + id;
   
    const request = new Request(url,{
        method:"post",
        body: JSON.stringify({"timesubmitted": parseInt(time)}),
        headers:{
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    fetch(request).then(function(res){
        if(res.status===200){
            log("Success");
        }else{
            log("failed")
        }
    }).catch(error => {
        console.log(error);
    });
}
export const addfamilytime = (time, id, Storeid, userId) =>{
    const url = "/family/addtime/" + id;
    const request = new Request(url,{
        method:"post",
        body: JSON.stringify({"StoreId": Storeid, "timesubmitted": time, "userId": userId}),
        headers:{
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    fetch(request).then(function(res){
        if(res.status===200){
            log("Success");
        }else{
            log("failed")
        }
    }).catch(error => {
        console.log(error);
    });
}

export const removedexpired = (id, array) =>{
    const url = '/MapList/' + id;
    const averagetime = parseInt(array.reduce(function(sum, n){
        return sum + n.time
    },0)/array.length);

    const waitstring = !isNaN(averagetime)? (averagetime + "min"):"Unavailable"; 
    const request = new Request(url,{
        method:"PATCH",
        body: JSON.stringify([{  "path": "/timesubmitted", "value": array}, 
        {"path":"/wait", "value": waitstring}]),
        headers:{
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })

    fetch(request).then(function(res){
        if(res.status===200){
            log("Success");
        }else{
            log("failed")
        }
    }).catch(error => {
        console.log(error);
    });
}

export const familytimechanges = (id,  array) =>{
    const url = '/family/' + id;
    
    const request = new Request(url,{
        method:"PATCH",
        body: JSON.stringify([{  "path": "/time", "value": array}, ]),
        headers:{
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })

    fetch(request).then(function(res){
        if(res.status===200){
            log("Success");
        }else{
            log("failed")
        }
    }).catch(error => {
        console.log(error);
    });
}