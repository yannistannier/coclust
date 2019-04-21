import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {Bar, Doughnut, Line, Pie, Polar, Radar, HorizontalBar} from 'react-chartjs-2';
import { BounceLoader, BarLoader } from 'react-spinners';
import axios from 'axios'


class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text:null,
      result:[],
      count:{
        "gene":0,
        "disease":0
      }
    };
    this.goSearch = this.goSearch.bind(this)
  }


goSearch(){

  axios.post('http://163.172.28.221:5000/ner', {
    text: this.state.text
  })
  .then(function (response) {
    this.setState({result:response.data.text})
    this.setState({count:response.data.count})
    console.log(response.data.text)
  }.bind(this))
  .catch(function (error) {
    console.log(error);
  });

}


render() {

   let datas = this.state.result.map(function(d, idx){
      if(d[1] == "GENE"){
        return <Badge key={idx} pill color="primary">{d[0]}</Badge>
      }
      else if(d[1] == "DISEASE"){
        return <Badge key={idx}pill color="success">{d[0]}</Badge>
      }else{
        return <span key={idx} > {d[0]} </span>
      }
    })

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="4" sm="4" md="4">

              <Card>
                <CardHeader className="text-center">
                  Saisir votre text
                </CardHeader>
                <CardBody>
                  <FormGroup>
                     <Input onChange={(e) => this.setState({text:e.currentTarget.value})} type="textarea" id="cvv" placeholder="Saisir du text"  rows={5} />
                  </FormGroup>
                     <Button outline block active type="submit" color="success" onClick={() => this.goSearch() }>
                              <i className="fa fa-dot-circle-o"></i> Envoyer
                      </Button>
                </CardBody>
              </Card>
          </Col>
          <Col xs="6" sm="6" md="6">
              
            <Card>
              <CardHeader className="text-center">
                Resultat
              </CardHeader>
              <CardBody>
                  
                  {this.state.result.length > 0 && 
                      <div className="justify" style={{whiteSpace: "pre-line"}}>{datas}</div>
                  }

                  {this.state.result.length == 0 &&  
                      <div className="text-center"> No data </div>
                  }
              </CardBody>
            </Card>
          </Col>

          <Col xs="2" sm="2" md="2">
              
            <Card>
              <CardHeader className="text-center">
                Entité
              </CardHeader>
              <CardBody>
                  
                  <h4>  <Badge pill color="primary">Gene</Badge> : {this.state.count.gene}</h4>
                  <h4>  <Badge pill color="success">Disease</Badge> : {this.state.count.disease} </h4>
  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

export default Archive;