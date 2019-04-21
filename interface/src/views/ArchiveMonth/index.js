import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {Bar, Doughnut, Line, Pie, Polar, Radar, HorizontalBar} from 'react-chartjs-2';
import { BounceLoader, BarLoader } from 'react-spinners';
import axios from 'axios'

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class ArchiveMonth extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
      
  }

  render() {

    return (
    	<div className="animated fadeIn">
        
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:16}}> Article concernant l'Autisme </div>
              </CardHeader>
              <CardBody style={{fontSize:14}}>
                <div className="">
                  Cette section présente les retours de notre modèle de NER pré entrainé sur le jeu de données asthma et testé sur le jeu de données autism, tout deux fournis au début du projet.
                </div>

                <div className="" style={{marginTop:10}}>
                  Ces deux jeux de données indépendants sont en réalité une concaténation de multiples articles scientifiques portant sur des sujets bio-médicaux. Ainsi en entrainant notre modèle spacy sur Asthma nous voulions avoir un retour de cohérence de sa capacité de détection des entités Gene et Disease sur un jeu de données similaire n'ayant pas servi lors de l'apprentissage mais sémantiquement identique.
                </div>

              </CardBody>
            </Card>

          </Col>
        </Row>
        

      </div>
    )
  }

}

export default ArchiveMonth;