import React, {Component} from 'react';
import "./family-member.css"

export default class FamilyMember extends Component{

    constructor(props) {
        super(props)
    
        this.state = {
             name: this.props.name,
        }
        this.onInputChange = this.onInputChange.bind(this)
    }

    onInputChange(e){
        this.setState({
            [e.target.name] : e.target.value
         })
    }

    render() {
        let infoBox = 
        <div className='FamilyMember-info'>
            <p className="FamilyMember-info">{this.state.name}</p>
        </div>
        
        return (
            <div className="FamilyMember container">
                {infoBox}
            </div>
        )
    }

}
