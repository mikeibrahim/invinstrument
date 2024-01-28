import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();

    // var cursor = this.osmd.cursor;
    // cursor.show();
    // cursor.next();
    // const cursorVoiceEntry = cursor.Iterator.CurrentVoiceEntries[0];
    // const lowestVoiceEntryNote = cursorVoiceEntry.Notes[0];
    // console.log("Stem direction of VoiceEntry under Cursor: " + cursorVoiceEntry.StemDirection);
    // console.log("base note of Voice Entry at second cursor position: " + lowestVoiceEntryNote.Pitch.ToString());
  }

  setupOsmd() {
    const options = {
      autoResize: this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle: this.props.drawTitle !== undefined ? this.props.drawTitle : true,
    }
    this.osmd = new OSMD(this.divRef.current, options);
    this.osmd.load(this.props.file).then(() => this.osmd.render());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  componentDidUpdate(prevProps) {
    if (this.props.file !== prevProps.file) {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
    }
    if (this.props.show !== prevProps.show) {
      this.osmd.cursor.show();
    }
    window.addEventListener("resize", () => this.resize);
  }

  // Called after render
  componentDidMount() {
    this.setupOsmd();
  }

  render() {
    return (<div ref={this.divRef} />);
  }
}

export default OpenSheetMusicDisplay;