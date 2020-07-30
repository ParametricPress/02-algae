import React, { Component } from 'react';

class treeSimulator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      branches: []
    }
    
    
   
  };
  restart = e => {
    this.branchList = this.createBranches(this.NUM_OF_BRANCHES);
    this.setState({ branches: this.branchList });
  };
  setColor(r) {
    //hue based on r : 0 -60 red to yellow
    var s = 120;
    var l = 100;
    var c = this.hslToHex(r * 5, s, l);
    return c;
  }
  createBranches(num) {

    var deg_to_rad = Math.PI / 180.0;
    var depth = 5;
    let length=2+Math.random()*.6;
    let branches = [];
    let _self=this;
    function drawTree(x1, y1, angle, depth){
        angle+=10-Math.random()*20;

      if (depth !== 0){
        var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * length);
        var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * length);
        //let color=_self.setColor(12+(2*depth));
        let color=_self.setColor(Math.random()*2*depth);
        let branch={x1:x1,y1: y1, x2:x2, y2:y2, depth:depth,color:color};
        branches.push(branch);


        //drawTree(x2, y2, angle - 20, depth - 1);
        //drawTree(x2, y2, angle + 20, depth - 1);
        drawTree(x2, y2, angle - 25, depth - 1);
        drawTree(x2, y2, angle , depth - 1);
        drawTree(x2, y2, angle + 25, depth - 1);
      }
    }

    let angle=-100+Math.random()*20;
    drawTree(100, 200, angle, depth);
    drawTree(10, 200, angle, depth);
   
    
    return branches;
  }
  pressMe = (e) => {
    e.preventDefault();
    this.restart();
  }
  
  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  componentDidMount() {
    this.NUM_OF_BRANCHES = 200;
    

    this.restart();
  }
  updateFrame() {
    /*
    this.onEnterFrame();
    this.setState({ balls: this.ballList });
    requestAnimationFrame(() => { this.updateFrame() });
    */
  }
  render() {
    console.log(this.state.branches);
    const viewHeight = 300;
    return (
      <div className="app">
        <div className="header"><h1>Recursive Tree : SVG + React</h1>  </div>
        <div className="content">
          {/* omitting width and height should cause scale to window */}
          <svg xmlns="http://www.w3.org/2000/svg" onClick={this.pressMe}
            viewBox={"0 0 200  " + viewHeight} >
            {this.state.branches.map((b, i) => (
              <g id="svg_1" key={i}>             
             <line id="svg_2" x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                  strokeWidth=".3"
                  stroke={b.color}
                 
                />
              </g>))}
          </svg>
        </div>
      </div>
    );
  }
}

export default treeSimulator;