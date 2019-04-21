import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table, TabContent, TabPane, CustomInput} from 'reactstrap';
import { BounceLoader, BarLoader } from 'react-spinners';
import MultiSelect from "@kenshooui/react-multi-select";
import Select from 'react-select';
import axios from 'axios'
import classnames from 'classnames';
import Switch from "react-switch";
import "@kenshooui/react-multi-select/dist/style.css"

class Coclust extends Component {
  constructor(props) {
    super(props);
    this.selectGenes = this.selectGenes.bind(this);
    this.handleChangeTFIDF = this.handleChangeTFIDF.bind(this)
    this.selectMaladies = this.selectMaladies.bind(this)
    this.toggle = this.toggle.bind(this);
    this.goAnalyse = this.goAnalyse.bind(this)
    this.handleCoclust = this.handleCoclust.bind(this)

    this.state = {
      maladies:[],
      genes:[],
      selectGenes:[],
      activeTab: '1',
      selectedItems: [],
      coclust:1,
      tfidf:true,

      img1:null
    };
  }

  componentDidMount(){
    this.getMaladies()
  }

  selectGenes(selectedItems) {
    this.setState({
      selectGenes: selectedItems
    });
  }

  handleChangeTFIDF(check) {
    this.setState({tfidf:check});
  }

  handleCoclust(e) {
    this.setState({coclust:e.target.value})
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  selectMaladies(selectedItems) {
    axios.get('http://localhost:5000/maladies_genes/'+selectedItems.value)
    .then(function (response) {
      this.setState({genes: response.data});
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });

  }


  getMaladies(){
    axios.get('http://localhost:5000/maladies')
    .then(function (response) {
      this.setState({
        maladies: response.data
      });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
  }


  goAnalyse(){

    axios.post('http://localhost:5000/genes_termes', {
      genes: this.state.selectGenes, tfidf : this.state.tfidf, coclust: this.state.coclust
    })
    .then(function (response) {
      console.log(response.data)
      this.setState({
        img1: response.data.img
      });
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });

  }


render() {
    const { items, selectedItems, maladies, genes, img1} = this.state;

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="4" sm="4" md="4">
              <Card>
                <CardHeader className="text-center">
                  Configuration
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label for="exampleSelect">Choisir une maladie</Label>
          
                    <Select
                      options={maladies}
                      onChange={this.selectMaladies}
                    />
                  </FormGroup>


                  <FormGroup>
                    <Label for="exampleSelect">Choisir les genes</Label>
                    <MultiSelect
                        items={genes}
                        selectedItems={selectedItems}
                        onChange={this.selectGenes}
                        height={250}
                        itemHeight={30}
                        responsiveHeight={250}
                      />

                  </FormGroup>
                  
                  <hr />

                  <Row>
                      <Col>
                        <FormGroup>
                          <Label for="exampleSelect">Coclust Type</Label>
                          <Input type="select" name="select" id="exampleSelect" onChange={this.handleCoclust} >
                            <option value="1">CoclustMod</option>
                            <option value="2">CoclustSpecMod</option>
                            <option value="3">CoclustInfo</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col>
                        <FormGroup>
                          <Label for="exampleSelect">Nb Cluster</Label>
                          <Input type="email" name="email" id="exampleEmail" placeholder="" />
                        </FormGroup>
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                      <label htmlFor="material-switch">
                      <FormGroup>
                          <div>
                          <Label>TF-IDF</Label>
                          </div>
                          <Switch
                            checked={this.state.tfidf}
                            onChange={this.handleChangeTFIDF}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={25}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={15}
                            width={40}
                            className="react-switch"
                            id="material-switch"
                          />
                           </FormGroup>
                        </label>
                      </Col>

                      <Col>

                      </Col>

                  </Row>


                  <FormGroup>
                    <Label for="exampleSelect">Definir la distance</Label>
                    <Input type="select" name="select" id="exampleSelect">
                      <option>Euclidian</option>
                      <option>Hamming</option>
                      <option>Jaccob</option>
                      <option>Cosinus</option>
                    </Input>

                  </FormGroup>



                  <Button outline block active type="submit" color="success" onClick={() => this.goAnalyse() }>
                          <i className="fa fa-dot-circle-o"></i> Analyser
                  </Button>
                </CardBody>
              </Card>
          </Col>
          <Col xs="8" sm="8" md="8">
            
          <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '1' })}
                      onClick={() => { this.toggle('1'); }} >
                      Genes - terms
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggle('2'); }} >
                      Genes - Article
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '3' })}
                      onClick={() => { this.toggle('3'); }} >
                      Genes - Genes
                    </NavLink>
                  </NavItem>
                </Nav>


                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                      <img src={"http://localhost:5000/images/test.jpg"}  height={400}/>
                  </TabPane>
                  <TabPane tabId="2">
                    salut
                  </TabPane>
                  <TabPane tabId="3">
                    salut
                  </TabPane>
                </TabContent>


          </Col>

        </Row>
      </div>
    )
  }

}

export default Coclust;