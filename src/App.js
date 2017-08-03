import React, { Component } from 'react';
//import { render } from 'react-dom';
import logo from './logo.svg';
import './App.css';
import fetchJsonp from 'fetch-jsonp';
import { Button, Form, FormGroup, FormControl} from 'react-bootstrap/lib';
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
      stocksFinalData:[]
    }
    this.updateSymbol = this.updateSymbol.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.updateQunatity = this.updateQunatity.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateStock = this.updateStock.bind(this);
    this.calculateStockData = this.calculateStockData.bind(this);
  };

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
  updateStock(symbol){
    this.setState({stockData:{symbol:this.state.symbol,price:this.state.price,quantity:this.state.quantity,date:this.state.date}},
      () => this.setState({
        stocksFinalData: this.state.stocksFinalData.concat(this.state.stockData)
      }))
    
    //this.state.stocksFinalData.push(this.state.stockData)
    this.calculateStockData(symbol)
  }
  calculateStockData(symbol) {
    
    //console.log(symbol)
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
    .then(json => this.setState({data: json}));
  }

  render() {
    //console.log(this.state.data)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Stock Portfolio App</h2>
        </div>
        <div className="container">
          <div className = "row">
            <Form inline>
              <FormGroup controlId="symbol">
                <FormControl type="text" placeholder="Symbol" value={this.state.symbol} onChange={this.updateSymbol}/>
              </FormGroup>
              {' '}
              <FormGroup controlId="price">
                <FormControl type="number" placeholder="Price" value={this.state.price} onChange={this.updatePrice}/>
              </FormGroup>
              {' '}
              <FormGroup controlId="quantity">
                <FormControl type="number" placeholder="Qty" value={this.state.quantity} onChange={this.updateQunatity}/>
              </FormGroup>
              {' '}
              <FormGroup controlId="date">
                <FormControl type="date" placeholder="DD/MM/YYYY" value={this.state.date} onChange={this.updateDate}/>
              </FormGroup>
              {' '}
              <Button onClick={() => {{this.updateStock(this.state.symbol)}}}>
                +
              </Button>
            </Form>
            {this.state.data.map((stock, index) => 
              <div className="container">
                <div className="row">
                  <div className="col-lg-4 col-md-4" key={index}>
                    <p> {this.state.symbol} / {this.state.price} * {this.state.quantity} </p>
                  </div>
                  <div className="col-lg-4 col-md-4" >
                    <p> {stock.t} / {stock.l} </p>
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
