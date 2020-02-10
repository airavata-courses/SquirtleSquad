import React, { Component } from "react";
//import { signup } from "../auth/index";
import { Link } from "react-router-dom";

class Home extends Component{

    constructor() {
        super();
        this.state = {
            sessID: "5e3f30a12a343a0d2d1661c2",
            action: "",
            timeStamp: "",
        };
    }

     pushLog = data => {
        console.log("req sending: ",data);
        // Communicating with the backend on localhost:8080
        return fetch("http://localhost:8080/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(response => {
            console.log("res: ",response);
          })
          .catch(err => console.log(err));
      };

    
      clickSubmit = event => {
        event.preventDefault();
        this.setState({action: "testing", timeStamp: Date.now()}, () =>{
          const jobs = this.state;
          console.log("req: ",jobs);
          this.pushLog(jobs);
        })

      };

      render() {
        const { name, email, password, error, open } = this.state;
        return (
          <div className="container">
            <h2 className="mt-5 mb-5">Sign Up</h2>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Submit Job
      </button>
          </div>
        );
      }
}

export default Home;

