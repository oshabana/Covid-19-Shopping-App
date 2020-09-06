const log = console.log;

export const joinFamily = (family) => {
    const url = `/family/join/${family}`;
    const request = new Request(url, {
        method: "PATCH",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
export const resetpass = (id, email,password)=>{
    const url = "/reset/" + id;
   
    const request = new Request(url,{
        method:"POST",
        body: JSON.stringify({"email":email,"password": password}),
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
export const declineFamily = (family) => {
    const url = `/family/decline/${family}`;
    const request = new Request(url, {
        method: "PATCH",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const joinTribe = (tribe) => {
    console.log("Join", tribe);
    const url = `/tribe/join/${tribe}`;
    const request = new Request(url, {
        method: "PATCH",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const declineTribe = (tribe) => {
    console.log("Decline", tribe);
    const url = `/tribe/decline/${tribe}`;
    const request = new Request(url, {
        method: "PATCH",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const createFamily = (name) => {
    const url = "/family";
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify({ familyName: name }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const createTribe = (name) => {
    const url = "/tribe";
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify({ tribeName: name }),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                log("Success");
            } else {
                log("failed");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
