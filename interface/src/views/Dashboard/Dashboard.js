import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table
} from 'reactstrap';


class Dashboard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      radioSelected: 2
    };
  }

   
  render() {
    return (
      <div className="animated fadeIn">
      	
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:24}}><b>Project Text Mining - Reconnaissance d'entités nommées</b> </div>
              </CardHeader>
              <CardBody style={{fontSize:16}}>
                <div className="text-center">Ce projet de text-mining s'inscrit dans une démarche de detection automatique de données biomédicales dans des textes (Genes, Disease) afin de catégoriser plus facilement des documents en fonction de leur contenu.</div>
                <div className="text-center"> <br/>Cette interface permet de tester directement notre model spacy sur n'importe quel contenu.</div>
                
                <Row>
                  <Col xs="12" sm="12" md="12" className="text-center">
                    <div className="text-center" style={{paddingTop:40}}> <a href="#/ner">Tester le model</a> </div>
                  </Col>

                </Row>

              </CardBody>
            </Card>

            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:24}}> <b>Team</b> </div>
              </CardHeader>
              <CardBody>
                <Row style={{paddingTop:20}}>
                    <Col xs="12" sm="6" md="6" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://raw.githubusercontent.com/yannistannier/textmining/master/images/1.jpeg" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Tannier Yannis</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey"}}>Ingénieur Deep learning chez Idemia</div>
                    </Col>

                    <Col xs="12" ssm="6" md="6" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://raw.githubusercontent.com/yannistannier/textmining/master/images/0.jpeg" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Joseph Gesnouin</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey" }}>Data Scientist chez Orange Labs</div>
                    </Col>


                </Row>

              </CardBody>
            </Card>
          </Col>
        </Row>
        

      </div>
    )
  }
}

export default Dashboard;
