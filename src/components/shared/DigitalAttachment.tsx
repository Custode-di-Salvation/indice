import { useEffect, useState } from 'react';
import type { MediaFormat } from '../../types';

export function DigitalAttachment({ file, format, title }: { file: string; format?: MediaFormat; title: string }) {
  const [text, setText] = useState<string>('Caricamento allegato…');
  const isText = !format || format === 'testo';

  useEffect(() => {
    if (!isText) return;
    let active = true;
    fetch(file)
      .then(response => {
        if (!response.ok) throw new Error('Allegato non disponibile');
        return response.text();
      })
      .then(content => active && setText(content))
      .catch(() => active && setText('Impossibile leggere la copia digitale locale.'));
    return () => { active = false; };
  }, [file, isText]);

  return <div className="viewer-frame">
    <div className="viewer-toolbar">
      <span>{(format || 'testo').toUpperCase()} · COPIA DIGITALE LOCALE</span>
      <a href={file} target="_blank" rel="noreferrer">APRI ALLEGATO ↗</a>
    </div>
    {isText && <pre className="viewer-page viewer-text">{text}</pre>}
    {format === 'immagine' || format === 'scansione' ? <img className="viewer-image" src={file} alt={title}/> : null}
    {format === 'audio' ? <audio className="viewer-media" controls src={file}/> : null}
    {format === 'video' ? <video className="viewer-media" controls src={file}/> : null}
    {format === 'pdf' ? <iframe className="viewer-pdf" src={file} title={title}/> : null}
  </div>;
}
