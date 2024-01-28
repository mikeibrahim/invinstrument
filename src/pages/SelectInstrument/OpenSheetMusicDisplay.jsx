import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

export default function OpenSheetMusicDisplay({ setupOsmd, file }) {
  let divRef = useRef(null)

  useEffect(() => { setupOsmd(divRef, file) }, [])

  return <div ref={divRef} />;
}