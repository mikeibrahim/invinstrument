import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

export default function OpenSheetMusicDisplay({ file }) {
  let divRef = useRef(null)

  useEffect(() => {
    const osmd = new OSMD(divRef.current, { autoResize: true, drawTitle: true })
    // osmd.load(file).then(() => this.render())
  }, [file])

  return <div ref={divRef} />
}