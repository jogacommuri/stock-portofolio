import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fetchJsonp from 'fetch-jsonp';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      symbol: '',
      price: '',
      quantity: '',
      date: ''
    }
    this.updateSymbol = this.updateSymbol.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.updateQunatity = this.updateQunatity.bind(this);
    this.updateDate = this.updateDate.bind(this);

  };

  updateState(e){
    this.setState({data: e.target.value});
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
  componentDidMount() {
    const url = 'http://finance.google.com/finance/info?q=NASDAQ:AAPL,NASDAQ:GOOG,NASDAQ:V'
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
    console.log(this.state.data)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Stock Portfolio App</h2>
        </div>
        <div className="stock-form{">
          <input type="text" value={this.state.symbol} onChange={this.updateSymbol} placholder="Symbol"/>
          <input type="text" value={this.state.price} onChange={this.updatePrice} placholder="Price"/>
          <input type="text" value={this.state.quantity} onChange={this.updateQunatity} placholder="Quantity"/>
          <input type="text" value={this.state.date} onChange={this.updateDate} placholder="Date"/>
          <h4> {this.state.symbol}</h4>
          <h4> {this.state.price}</h4>
          <h4> {this.state.quantity}</h4>
          <h4> {this.state.date}</h4>
          {this.state.data.map((stock, index) => 
            <div key={index} className="test">
            <h4> {stock.t}</h4>
            </div>
            )}

        </div>
      </div>
    );
  }
}

export default App;
