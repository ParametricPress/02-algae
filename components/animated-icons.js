// how to render an element conditionally on state 
// {this.state.imgViz ? null : <img src={this.props.svgsrc} />}
import React from "react";
import VisibilitySensor from "react-visibility-sensor";

class AnimatedIcons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        imgViz: false
      }
    console.log('Initializing custom React component.')
  }

//   const SampleComponent = () => {
//     // Show message state
//     return <h1>{this.state.imgViz ? "AAAAHHHH" : "Hi there!"}</h1>;
//   };

  render() {
    const { hasError, idyll, updateProps, clickCount, ...props } = this.props;
    return (
      <div {...props}>
        <VisibilitySensor 
        onChange={(isVisible) => {
          this.setState({imgViz: isVisible})
        }}
        >
        <div>
            <div class="flex-grid">
                <div class="icon-col">
                    <img src="static/images/algae-uses_plastic_animated.svg"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">plastic</p>
                </div>
                <div class="icon-col">
                    <img src="static/images/algae-uses_building.svg"
                        class="icon-col"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">carbon fiber</p>
                </div>
                <div class="icon-col">
                    <img src="static/images/algae-uses_feed.svg"
                        class="icon-col"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">animal feed</p>
                </div>
            </div>
            <div class="flex-grid">
                <div class="icon-col">
                    <img src="static/images/algae-uses_shirt.svg"
                        class="icon-col"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">t-shirts</p>
                </div>
                <div class="icon-col">
                    <img src="static/images/algae-uses_shoe.svg"
                        class="icon-col"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">shoes</p>
                </div>
                <div class="icon-col">
                    <img src="static/images/algae-uses_snack.svg"
                        class="icon-col"
                        style={{
                        width: 200,
                        height: 200,
                        opacity: this.state.imgViz ? 1 : 0.25,
                        transition: 'opacity 1000ms linear'
                        }}
                    />
                    <p class="icon-name">snacks</p>
                </div>
            </div>
        </div>
        </VisibilitySensor>
      </div>
    );
  }
}

module.exports = AnimatedIcons;
