import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

export default function OpenSheetMusicDisplay({ osmd, file }) {
  let divRef = useRef(null)

  useEffect(() => {
    const osmd = new OSMD(divRef.current, { autoResize: true, drawTitle: true })
    osmd.load(file).then(() => osmd.render())

    // osmd.cursor.show()
    // osmd.cursor.next()
  }, [])

  return <div ref={divRef} />;
}