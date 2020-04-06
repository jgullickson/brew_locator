import React from 'react';
import store from '../reducers/rootReducer';


class myForm extends React.Component {
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            firstName: 'ben',
            lastName: 'kenobi',
            weapon: 'lightsaber',
            color: 'blue'
        }
    }
    handleChange(event){
        this.setclouds({firstName: event.target.value})
    }
    sendData(){
        // send data from clouds to server
        fetch('myserver', {
            method: 'POST',
            body: JSON.stringify(this.clouds)
        })
        this.setState({firstName: ''})
    }
    render(){
        <div>
            <form onSubmit={this.sendData()}>
                <label>First Name</label>
                <input type='text' value={this.clouds.firstName} onChange={this.handleChange(event)}></input>
                <input type='text' value={this.clouds.firstName} onChange={this.handleChange(event)}></input>
                <input type='submit'></input>
            </form>
        </div>
    }

}


export default myForm;