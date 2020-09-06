import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./map.css";
import Map from './Map.item/Mapapi'
import { addtime, familytimechanges, addfamilytime } from '../../actions/maplist'
const log = console.log
const datetime = require('date-and-time');
export default class Maps extends Component {
  constructor(props) {
    super(props)

    // This data will all be pulled from a server
    this.state = {
        currentstate:{
          id: "",
          Store:"",
          Address:"",
          Hours:"",
          Wait_time:"",
        },
       
      
        City:{etobicoke:[43.618470, -79.514554],}
        ,citystate:"",
        currentcity:"etobicoke",
        timesubmitted:null,
        user: null,
        toggle: false,
        isalert:false,
        family: null,
        isfirst: false,
        isnew: true,
        isold: false

      }
 
    this.getdata= this.getdata.bind(this);
    this.changecity = this.changecity.bind(this);
    this.Keypress = this.Keypress.bind(this);
    this.changetimesubmitted = this.changetimesubmitted.bind(this);
    this.timesubmit = this.timesubmit.bind(this);
    
  }
  getdata(id,info, address, hour, wait){
    const something ={id:id,Store:info,Address:address,Hours:hour,
      Wait_time:wait,
    } 
    this.setState({currentstate:something})
  }
  changetimesubmitted(event){
    
    
    const target = event.target;
    const value = target.value;
    this.setState({timesubmitted: value});
  }
  changecity(event){
    
    const target = event.target;
    const value = target.value;
    this.setState({citystate: value});
  }
  timesubmit(event){
    const arrayid =  this.state.family.time.filter((result)=> result.StoreId === this.state.currentstate.id && result.userId === this.state.user.id)
    
    const key = event.Keycode || event.which;
    if (key === 13){
     
      if(!isNaN(this.state.timesubmitted) && this.state.currentstate.id !== "" && arrayid.length ===0){
       
          this.setState({isnew: !this.state.isold});
          addtime(this.state.timesubmitted, this.state.currentstate.id);
        
          addfamilytime(this.state.timesubmitted,this.props.user.familyID, this.state.currentstate.id, this.state.user.id)
        setTimeout(function () {
          this.setState({toggle:!this.state.toggle});
          this.setState({ timesubmitted: "" })
        }.bind(this), 1000)
      }
      else {
        if (this.state.currentstate.id === "") {
          this.setState({ timesubmitted: "Please select a store" ,isalert:true});
          setTimeout(function () {
            this.setState({ timesubmitted: "",isalert:false })
          }.bind(this), 1000)
        }
          else if (isNaN(this.state.timesubmitted)){
            this.setState({ timesubmitted: "Input should be a number",isalert:true });
            setTimeout(function () {
              this.setState({ timesubmitted: "",isalert:false })
            }.bind(this), 1000)
          }
        
         else if (arrayid.length >0) {

          this.setState({ timesubmitted: "Submission was made" ,isalert:true});
          setTimeout(function () {
            this.setState({ timesubmitted: "",isalert:false })
          }.bind(this), 1000)
        }


    }
    
  }

  }
  componentDidMount(){
    const url = "/City";
    fetch(url, {
      method: "GET"
    }).then(res => {
      if (res.status === 200) {
        return res.json();

      } else {
        log("Could not get data");
      }
    }).then(function (json) {
      

      this.setState({ City: json});
     
    }.bind(this)).catch(error => {
      log(error)
    })
    


  }
  componentDidUpdate(){

    if(this.props.user && this.props.user.familyID){
      if (this.state.isnew !== this.state.isold ){
        this.setState({isnew: this.state.isold})
        const furl = "/family/" + this.props.user.familyID;
        fetch(furl, {
          method: "GET"
        }).then(res => {
          if (res.status === 200) {
            return res.json();
    
          } else {
            log("Could not get data");
          }
        }).then(function (json) {
         
        
          this.setState({ family: json});
          
    
        }.bind(this)).catch(error => {
          log(error)
        })
        const url = "/users";
    
        fetch(url, {
          method: "GET"
        }).then(res => {
          if (res.status === 200) {
            return res.json();
    
          } else {
            log("Could not get data");
          }
        }).then(function (json) {
          
    
          this.setState({ user: json});
    
        }.bind(this)).catch(error => {
          log(error)
        })
      }
     
  


       if (!this.state.isfirst  ){
             if (this.state.family !== null){
    
          this.setState({isfirst: true})
          const newtime = new Date();
          const newarray = this.state.family.time.filter((obj) => 
                datetime.subtract(newtime, new Date(obj.date)).toHours() < 24
            
        )
        familytimechanges(this.state.family._id,newarray )
      }
    }
  }
  
  }
  Keypress(event){
    const key = event.Keycode || event.which;
    
          if (key === 13){
            
            if(this.state.citystate.toLowerCase() in this.state.City){
              
              
              this.setState(({citystate}) => ({
              citystate: "",
              currentcity: citystate.toLowerCase(),
            
            
            }));
    
          }
          else{
            this.setState({citystate: "City does not exist",isalert:true});
            setTimeout(function(){
              this.setState({citystate:"",isalert:false})
            }.bind(this),1000)
  
          }
          
        }
   

  }

  
  
  render() {
    return (
      <div className='mapcenter container-xl' >
        <div className="row">
          <div className="mapcolor p-1 m-0 col-lg-9 border border-dark">
            <Map name = {this.state.currentcity} toggle={this.state.toggle} city = {this.state.City[this.state.currentcity]} senddata= {this.getdata}/>
          </div>
          <div className="backcolor p-0 m-0 col-3 border border-dark " >
            <div className="mapborderbottom" >
              <input name = "currentcity" 
              value = {this.state.citystate} 
              onChange={this.changecity} 
              onKeyUp={this.Keypress} 
              autocomplete="off"
              type="text" 
              className={!this.state.isalert?"inputext m-2 border-dark":"inputext m-2 border-dark text-danger "}  placeholder="Enter City" 
     />
             
            </div>
            <div className= "infor">
            <p>Store Info: <strong>{this.state.currentstate.Store}</strong> </p>
            <p>Address: <strong>{this.state.currentstate.Address}</strong> </p>
            <p>Hours: <strong>{this.state.currentstate.Hours}</strong> </p>
            <p>Wait time: <strong>{this.state.currentstate.Wait_time }</strong> </p>
            </div>
            {this.props.user?this.props.user.familyID?<div className="bottomtext">
              <span> Report how long your visit took</span>
              <input name= "report" value = {this.state.timesubmitted} onChange={this.changetimesubmitted}
               onKeyUp={this.timesubmit}  type= "text" className={!this.state.isalert?"waitTime":"waitTime text-danger"} placeholder="Enter time taken"></input>
            </div>: <div></div>:<div></div>}
          </div>
          </div>
        </div>
    )
  }
}