import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Progress } from 'antd';

import './style.css';

export default class Test extends React.Component {

  render() {
    return (
      <div className="test">
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="ghost">Ghost</Button>
        <Button type="dashed">Dashed</Button>
      </div>
    );
  }
}

//fetch('/api/aa').then(data => console.log(data))
