const log = console.log

export const inviteFamily = async (user) => {

    try {
        const url = `/user/${user}`;
        const request = new Request(url,{
            method:"GET",
            headers:{
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        const response = await fetch(request, {})
        const json = await response.json()
        const uid = await json[0]._id
        
        const url2 = `/family/invite/${uid}`
        const request2 = new Request(url2,{
            method:"PATCH",
            headers:{
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        const resp2 = await fetch(request2, {})
        const json2 = await resp2.json()
        console.log(json2)
    
    } catch (error) {
        console.log(error);
    }
};


export const inviteTribe = async (user, tribe) => {
    
    try {
        const url = `/user/${user}`;
        const request = new Request(url,{
            method:"GET",
            headers:{
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        const response = await fetch(request, {})
        const json = await response.json()
        const uid = await json[0]._id
    
        const url2 = `/tribe/invite/${uid}`;
        const request2 = new Request(url2,{
            method:"PATCH",
            body: JSON.stringify({"tribeName": tribe}),
            headers:{
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        const resp2 = await fetch(request2, {})
        const json2 = await resp2.json()
        console.log(json2)
        
    } catch (error) {
        console.log(error);
    }

}