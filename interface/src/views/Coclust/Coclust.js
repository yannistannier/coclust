import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table, TabContent, TabPane, CustomInput} from 'reactstrap';
import MultiSelect from "@kenshooui/react-multi-select";
import Select from 'react-select';
import axios from 'axios'
import classnames from 'classnames';
import Switch from "react-switch";
import "@kenshooui/react-multi-select/dist/style.css"
import Loader from 'react-loader-spinner'


import {HorizontalBar} from 'react-chartjs-2';



class Coclust extends Component {
  constructor(props) {
    super(props);
    this.selectGenes = this.selectGenes.bind(this);
    this.handleChangeTFIDF = this.handleChangeTFIDF.bind(this)
    this.selectMaladies = this.selectMaladies.bind(this)
    this.toggle = this.toggle.bind(this);
    this.goAnalyse = this.goAnalyse.bind(this)
    this.handleCoclust = this.handleCoclust.bind(this)
    this.handleNbCluster = this.handleNbCluster.bind(this)
    this.handleDistance = this.handleDistance.bind(this)
    this.callApi = this.callApi.bind(this)

    this.state = {
      maladies:[],
      genes:[],
      selectGenes:[],
      activeTab: '1',
      selectedItems: [],
      coclust:1,
      tfidf:false,
      nb:2,
      distance:"euclidean",

      tab1:null,

      tab2:null,
      cluster2:[],

      tab3:null
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

  handleNbCluster(e){
    this.setState({nb:e.target.value})
  }

  handleCoclust(e) {
    this.setState({coclust:e.target.value})
  }

  handleDistance(e) {
    this.setState({distance:e.target.value})
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });

      console.log(tab)


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

    // axios.post('http://localhost:5000/genes_termes', {
    //   genes: this.state.selectGenes, tfidf : this.state.tfidf, coclust: this.state.coclust
    // })
    // .then(function (response) {
    //   console.log(response.data)
    //   this.setState({
    //     img1: response.data.img,
    //     cluster1: response.data.cluster
    //   });
    // }.bind(this))
    // .catch(function (error) {
    //   console.log(error);
    // });

    if(this.state.genes.length > 0){
        if(this.state.activeTab == "1"){
            this.setState({tab1:"pending"})
            this.callApi("http://localhost:5000/genes_articles")
        }
        if(this.state.activeTab == "2"){
          this.setState({tab2:"pending"})
          this.callApi("http://localhost:5000/genes_termes")
        }
        if(this.state.activeTab == "3"){
          this.setState({tab3:"pending"})
          this.callApi("http://localhost:5000/genes_genes")
        }
        
    }
  }

  callApi(url){
      axios.post(url, {
        genes: this.state.selectGenes, tfidf : this.state.tfidf, coclust: this.state.coclust,
        nb : this.state.nb, distance:this.state.distance
      })
      .then(function (response) {
        console.log(response.data)
        if(response.data.tab == 1){
          this.setState({tab1:"fullfilled"})
        }

        if(response.data.tab == 2){
          this.setState({tab2:"fullfilled", cluster2: response.data.cluster})
        }

        if(response.data.tab == 3){
          this.setState({tab3:"fullfilled"})
        }
        
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }


render() {
    const { items, selectedItems, maladies, genes, distance, img1, cluster2, tab1, tab2, tab3} = this.state;
    let r = Math.random().toString(36).substring(7);

    let c1 = cluster2.map(function(d, idx){
      console.log(d)
      return ( 
          <div key={idx}>
            <HorizontalBar
              data={{
                labels: d["name"],
                datasets: [
                  {
                    label: 'Cluster' + idx,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: d["value"]
                  }
                ]
              }}
              height={250}
              options={{
                maintainAspectRatio: false
              }}
            /> 
        </div>
      )
    })

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
                          <Label for="exampleSelect">Nb Cluster (0 if auto)</Label>
                          <Input type="email" name="nb" id="nb" value={this.state.nb} onChange={this.handleNbCluster} />
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
                    <Input type="select" name="select" id="exampleSelect" onChange={this.handleDistance}>
                      <option value="euclidean">Euclidean</option>
                      <option value="hamming">Hamming</option>
                      <option value="jaccard">Jaccard</option>
                      <option value="cosine">Cosine</option>
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
                      Genes - Article
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggle('2'); }} >
                      Genes - terms
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
                    {tab1 == "fullfilled" &&
                      <div> 
                          <h3> Coclust </h3>
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-ga1-"+r+".jpg"}  width="100%" style={{maxHeight:250}}/>
                          </div>
                          <h3 style={{marginTop:30, marginBottom:20}}> Hierarchical Clustering - {distance} </h3>
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-ga2-"+r+".jpg"}  width="70%"/>
                          </div>
                      </div>
                    }
                    {tab1 == "pending" &&
                      <div style={{textAlign:"center", padding:50}}>
                        <Loader type="Grid" color="#4dbd74" />
                      </div>
                    }
                    {tab1 == null &&
                      <div style={{textAlign:"center"}}>
                          No data
                      </div>
                    }


                    </TabPane>
                  <TabPane tabId="2" >

                    {tab2 == "pending" &&
                      <div style={{textAlign:"center", padding:50}}>
                        <Loader type="Grid" color="#4dbd74" />
                      </div>
                    }

                    {tab2 == null &&
                      <div style={{textAlign:"center"}}>
                          No data
                      </div>
                    }
                     {tab2 == "fullfilled" &&
                        <div>
                          <h3> Hierarchical Clustering - {distance}</h3>
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-gt2-"+r+".jpg"}  height={300}/>
                          </div>

                          <h3> Coclust </h3>
                          <h4 /> 
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-gt1-"+r+".jpg"}  height={300}/>
                          </div>

                          <div style={{textAlign:"center", paddingLeft:40, paddingRight:40}}>
                            {c1}
                          </div>
                        </div>
                     }

                  </TabPane>
                  
                  <TabPane tabId="3">
                    {tab3 == "pending" &&
                      <div style={{textAlign:"center", padding:50}}>
                        <Loader type="Grid" color="#4dbd74" />
                      </div>
                    }

                    {tab3 == null &&
                      <div style={{textAlign:"center"}}>
                          No data
                      </div>
                    }

                      {tab3 == "fullfilled" &&
                        <div>
                          <h3> Hierarchical Clustering - {distance}</h3>
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-gg1-"+r+".jpg"}  width="100%" style={{maxHeight:250}} />
                          </div>

                          <h3> Coclust </h3>
                          <h4 /> 
                          <div style={{textAlign:"center"}}>
                            <img src={"http://localhost:5000/images/img-gg2-"+r+".jpg"}  width="70%"/>
                          </div>
                        </div>
                     }
                  </TabPane>
                </TabContent>


          </Col>

        </Row>
      </div>
    )
  }

}

export default Coclust;