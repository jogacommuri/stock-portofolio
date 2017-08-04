import React, { Component } from 'react';
//import { render } from 'react-dom';
import logo from './logo_1.png';
import './App.css';
import fetchJsonp from 'fetch-jsonp';
import { Button, Form, FormGroup, FormControl, Modal, Col} from 'react-bootstrap/lib';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      symbol: '',
      price: '',
      quantity: '',
      date: '',
      stockData: {},
      modalContent:'',
      showModal: false,
      showErrorModal: false,
      stocksFinalData:(localStorage.getItem(('stocksFinalData')) ? (JSON.parse(localStorage.getItem('stocksFinalData'))) : [] ) 
    }
    this.updateSymbol = this.updateSymbol.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.updateQunatity = this.updateQunatity.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateStock = this.updateStock.bind(this);
    this.updateModalSymbol = this.updateModalSymbol.bind(this);
    this.updateModalPrice = this.updateModalPrice.bind(this);
    this.updateModalQunatity = this.updateModalQunatity.bind(this);
    this.updateModalDate = this.updateModalDate.bind(this);
    this.calculateStockData = this.calculateStockData.bind(this);
    this.removeStock = this.removeStock.bind(this);
    //this.showErrorModal = this.showErrorModal.bind(this);
    this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
  };
  /**
   * Shows edit modal.
   */
  handleOpenModal (targetOffer) {
    this.setState({
      showModal: true,
      modalContent: targetOffer
    });
  }
  /**
  * Hides edit modal.
   */
  handleCloseModal () {
      this.setState({ showModal: false });
  }
  handleCloseErrorModal () {
      this.setState({ showErrorModal: false });
  }
  updateSymbol(e){
    this.setState({symbol: e.target.value});
  }
  updatePrice(e){
    this.setState({price: e.target.value});
  }
  updateQunatity(e){
    this.setState({quantity: e.target.value});
  }
  updateDate(e){
    this.setState({date: e.target.value});
  }
  updateModalSymbol(e){
    this.setState({ modalContent : Object.assign({}, this.state.modalContent , {symbol: e.target.value})})
  }
  updateModalPrice(e){
    this.setState({ modalContent : Object.assign({}, this.state.modalContent , {price: e.target.value})})

  }
  updateModalQunatity(e){
    this.setState({ modalContent : Object.assign({}, this.state.modalContent , {quantity: e.target.value})})

  }
  updateModalDate(e){
    this.setState({ modalContent : Object.assign({}, this.state.modalContent , {date: e.target.value})})
  }
  removeStock(targetStock){
    console.log(targetStock);
    var stocks = this.state.stocksFinalData;
    for(var i=0;i<stocks.length;i++){
      if(stocks[i].symbol === targetStock.symbol){
         console.log(stocks[i].symbol);
         stocks.splice(i,1)
         console.log(stocks);
      }else {
        console.log("false")
      }
    }
    this.setLocalStorage(this.state.stocksFinalData)
    this.handleCloseModal();
  }
  updateModalContent(modalContent){
    console.log(modalContent)
    var stocks = this.state.stocksFinalData;
    for(var i=0;i<stocks.length;i++){
      if(stocks[i].symbol === modalContent.symbol){
        console.log(stocks[i].symbol);
        stocks[i] = modalContent;
        stocks[i].value = stocks[i].price * stocks[i].quantity;
        stocks[i].profit = ((stocks[i].currPrice * stocks[i].quantity) - stocks[i].value);
        this.setState({stocksFinalData: stocks})
      } else {
        console.log("false")
      }
    }
    this.setLocalStorage(this.state.stocksFinalData)
    this.handleCloseModal();
  }
  clearInputFields(){
      this.setState({symbol:''})
      this.setState({price:''})
      this.setState({quantity:''})
      this.setState({date:''})
  }
  updateStock(){
    var value = (this.state.price * this.state.quantity);
    var currValue = (this.state.data[0].l * this.state.quantity)
    var profit = (currValue - value)
    this.setState({stockData:{
                              symbol:this.state.symbol,
                              price:this.state.price,
                              quantity:this.state.quantity,
                              date:this.state.date,
                              value: value,
                              currPrice: this.state.data[0].l,
                              profit: profit}},
      () => this.setState({
        stocksFinalData: this.state.stocksFinalData.concat(this.state.stockData)
      },() => this.setLocalStorage(this.state.stocksFinalData)))
    
    this.clearInputFields();

  }
  setLocalStorage(stocksFinalData){
    localStorage.setItem('stocksFinalData', JSON.stringify(stocksFinalData));
  }
  calculateStockData(symbol) {
    
    //console.log(symbol)
    if(symbol && this.state.price && this.state.quantity){
      var url = "http://finance.google.com/finance/info?q=NASDAQ:"+symbol
      fetchJsonp(url,{
        method: 'GET',
        mode: 'no-cors',
        json: true,
        headers:{
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials':true,
          'Access-Control-Allow-Methods':'POST, GET'
        }
      })
      .then(response => response.json())
      .then(json => this.setState({data: json},() => this.updateStock()))
    }
    else{
      this.setState({showErrorModal: true})
    }
  }
  validatePrice(e) {
    const res = /^[0-9.]+([0-9][0-9])?$/;
    if (!res.test(e.key)) {
      e.preventDefault();
    }
  }
  validateQuantity(e) {
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  render() {
    //console.log(this.state.data)
     const style ={
        color: '#333',
        textAlign: 'center'
      }
    return (
      
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        
          <Modal show={this.state.showErrorModal} onHide={this.handleCloseErrorModal} style={{top:'20%'}} className="modal-offer">
              <Modal.Header closeButton>
              <Modal.Title>
                  <p>Error</p>
                </Modal.Title>
                <Modal.Body>
                  <p>Please enter all the Details</p>
                </Modal.Body>
                </Modal.Header>
          </Modal>

        {this.state.modalContent &&
          <Modal show={this.state.showModal} onHide={this.handleCloseModal} style={{top:'20%'}} className="modal-offer">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Edit Details</p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="container">
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Form inline>
                    <FormGroup controlId="symbol">
                      <FormControl type="text" placeholder="Symbol" value={this.state.modalContent.symbol} onChange={this.updateModalSymbol}/>
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="price">
                      <FormControl type="number" placeholder="Price" value={this.state.modalContent.price} onChange={this.updateModalPrice}/>
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="quantity">
                      <FormControl type="number" placeholder="Qty" value={this.state.modalContent.quantity} onChange={this.updateModalQunatity}/>
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="date">
                      <FormControl type="date" placeholder="DD/MM/YYYY" value={this.state.modalContent.date} onChange={this.updateModalDate}/>
                    </FormGroup>
                    {' '}
                    <Button onClick={() => {{this.updateModalContent(this.state.modalContent)}}}>
                      Edit
                    </Button>
                  </Form>
                </Col>
                <Col className="modal-offer-details" md={9}>
                  
                </Col>
                </div>                          
              </Modal.Body>
            </Modal>
        }
        <div className="container">
          <div className = "row">
            <Form inline>
              <FormGroup controlId="symbol">
                <FormControl type="text" placeholder="Symbol"  required={true} value={this.state.symbol} onChange={this.updateSymbol} />
              </FormGroup>
              {' '}
              <FormGroup controlId="price">
                <FormControl type="number" placeholder="Price" onKeyPress={(e) => this.validatePrice(e)} required={true} value={this.state.price} onChange={this.updatePrice}/>
              </FormGroup>
              {' '}
              <FormGroup controlId="quantity">
                <FormControl type="number" placeholder="Qty" onKeyPress={(e) => this.validateQuantity(e)} required={true} value={this.state.quantity} onChange={this.updateQunatity}/>
              </FormGroup>
              {' '}
              <FormGroup controlId="date">
                <FormControl type="date" placeholder="DD/MM/YYYY" required={true} value={this.state.date} onChange={this.updateDate}/>
              </FormGroup>
              {' '}
              <Button onClick={() => {{this.calculateStockData(this.state.symbol)}}}>
                +
              </Button>
            </Form>
            {this.state.stocksFinalData.map((stock, index) => 
              <div className="container" key={index}>
                <div className="row">
                  <div className="col-lg-offset-2 col-md-offset-2 col-sm-12 col-xs-12 col-lg-8 col-md-8" style={style}>
                    <span>
                      <p> {stock.symbol} / {stock.price} * {stock.quantity} = {stock.value} / {stock.date}</p>
                      {stock.profit >0 ? <p className="profit"> {stock.currPrice} / {stock.profit}</p> : <p className="loss"> {stock.currPrice} / {stock.profit}</p>}
                    </span>
                    </div>
                    <div className="col-sm-12 col-xs-12 col-lg-2 col-md-2" style={style}>
                    <Button onClick={() => {{this.handleOpenModal(stock)}}}>
                     Edit
                    </Button>
                    {' '}
                    <Button onClick={() => {{this.removeStock(stock)}}}>
                     Delete
                    </Button>
                  </div>
                </div>
              </div>
              )}
          </div>
        </div>   
      </div>
      
    );
  }
}

export default App;
