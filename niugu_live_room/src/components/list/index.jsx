import React, { Component } from 'react';

export default class List extends Component {
  constructor() {
    super();
    this.state = {
      list: [1, 2, 3, 4, 5, 6]
    };
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.list.map((item) => {
            return <li key={item}>I am the {item}</li>;
          })}
        </ul>
      </div>
    );
  }
}
