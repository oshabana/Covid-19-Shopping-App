import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import './Mapapi.css'
import { removedexpired} from '../../../actions/maplist'
const someicon = new Icon({ iconUrl: "/cart.svg", iconSize: 25 });
const active = new Icon({ iconUrl: "/logo192.png", iconSize: 20 })
const datetime = require('date-and-time');
const log = console.log
export default class PublicMap extends Component {
  constructor(props) {
    super(props)

  this.state = {
    currentstate:null,
    groceries: [],
    toggle: false,
    oldtoggle: false,
    isfirst: false,
  
  };
  this.data = this.data.bind(this);
  this.selected = this.selected.bind(this);

}

  data(map) {
    if(map){
      this.props.senddata(map._id,map.name, map.address, map.open, map.wait)
    }else{
      this.props.senddata("","","","","")
    }
    
  }
  selected(map) {
    return (
      <Marker key={map._id} position={[
        map.coordinates[1],
        map.coordinates[0]

      ]}
        icon={active}
      />
    )
  }
  componentWillReceiveProps(){
    this.setState({toggle: this.props.toggle})
  }
  componentDidMount(){

    const url = "/MapList";
    fetch(url, {
      method: "GET"
    }).then(res => {
      if (res.status === 200) {
        return res.json();

      } else {
        log("Could not get data");
      }
    }).then(function (json) {
      

      this.setState({ groceries: json.groceries });
    

    }.bind(this)).catch(error => {
      log(error)
    })

    

   
  }
  componentDidUpdate(){
    if (!this.state.isfirst){
      
      const newtime = new Date();
        this.state.groceries.map((obj) => {
            const newtimearray = obj.timesubmitted.filter((time) => 
                datetime.subtract(newtime, new Date(time.date)).toHours() < 2
           
            )
         
            if (JSON.stringify(newtimearray) !== JSON.stringify(obj.timesubmitted)){
         
              
              removedexpired(obj._id, newtimearray);
            }
            
        })
        
      }

    if (this.state.oldtoggle !== this.state.toggle || !this.state.isfirst ){
      this.setState({oldtoggle: this.state.toggle});
      this.setState({isfirst: true})
  
    const url = "/MapList";
    fetch(url, {
      method: "GET"
    }).then(res => {
      if (res.status === 200) {
        return res.json();

      } else {
        log("Could not get data");
      }
    }).then(function (json) {
      

      this.setState({ groceries: json.groceries });


    }.bind(this)).catch(error => {
      log(error)
    })
  }
  }


 
  render() {  

    return (
      <div>
        {/* Map api from react leaflet https://react-leaflet.js.org/ */}
        <Map center={[this.props.city[0], this.props.city[1]]} zoom={12}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />

          {this.state.groceries.map(map => (
            <Marker key={map._id} position={[
              map.coordinates[1],
              map.coordinates[0]

            ]}


              onClick={() => {
                this.setState({currentstate: map}); this.data(map); this.selected(map);
              }}
              icon={this.state.currentstate?this.state.currentstate._id === map._id? someicon: active:active}>

              <Tooltip className='tooltip' direction='center' offset={[-90, 0]} opacity={1} permanent>
                <span>{map.wait === "Unavailable"? null: map.wait}</span>
              </Tooltip>
            </Marker>
          )
          )
          }
          {this.state.currentstate && (
            <Popup
              key={this.state.currentstate._id}
              position={[
                this.state.currentstate.coordinates[1],
                this.state.currentstate.coordinates[0]
              ]}
              closeButton={false}
              offset={[1, 0]}
              onClose={() => {
                this.setState({currentstate:null});
                this.data(null)
              }}
            >
              <div>
                <h6>You are here</h6>
              </div>
            </Popup>

          )}
        </Map>

      </div>

    )
  }
}


























// import OlMap from "ol/Map";
// import OlView from "ol/View";
// import OlLayerTile from "ol/layer/Tile";
// import OlSourceOSM from "ol/source/OSM";
// import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
// class PublicMap extends Component {
//   constructor(props) {
//     super(props);

//     this.state = { center: [0, 0], zoom: 1 };

//     this.olmap = new OlMap({
//         interactions: defaultInteractions().extend([
//             new DragRotateAndZoom()
//           ]),
//         dragging:true,
//       target: null,
//       DragRotateAndZoom:true,
//       layers: [
//         new OlLayerTile({
//           source: new OlSourceOSM()
//         })
//       ],
//       view: new OlView({
//         center: this.state.center,
//         zoom: this.state.zoom
//       })
//     });
//   }

//   updateMap() {
//     this.olmap.getView().setCenter(this.state.center);
//     this.olmap.getView().setZoom(this.state.zoom);
//   }

//   componentDidMount() {
//     this.olmap.setTarget("map");

//     // Listen to map changes

//     this.olmap.on("moveend", () => {
//       let center = this.olmap.getView().getCenter();
//       let zoom = this.olmap.getView().getZoom();
//       this.setState({ center, zoom });
//     });
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     let center = this.olmap.getView().getCenter();
//     let zoom = this.olmap.getView().getZoom();
//     if (center === nextState.center && zoom === nextState.zoom) return false;
//     return true;
//   }

//   userAction() {
//     this.setState({ center: [546000, 6868000], zoom: 5 });
//   }

//   render() {
//     this.updateMap(); // Update map on render?
//     return (
//       <div id="map" style={{ width: "100%", height: "100%" }}>
//       </div>
//     );
//   }
// }

// export default PublicMap;




// import GoogleMapReact from 'google-map-react';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

// class SimpleMap extends Component {
//   static defaultProps = {
//     center: {
//       lat: 59.95,
//       lng: 30.33
//     },
//     zoom: 11
//   };

//   render() {
//     return (
//       // Important! Always set the container height explicitly
//       <div style={{ height: '100%', width: '100%' }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: 'AIzaSyAN1Iob6BhUvuOmBq4ucOtHZSScFHdLs9I' }}
//           defaultCenter={this.props.center}
//           defaultZoom={this.props.zoom}
//         >
//           <AnyReactComponent
//             lat={59.955413}
//             lng={30.337844}
//             text="My Marker"
//           />
//         </GoogleMapReact>
//       </div>
//     );
//   }
// }

// export default SimpleMap;