import {Classifier} from '../src/model';
import {Capture, decode} from '../src/audio';
import {readRecord, writeRecord} from '../src/store';
import {RATE} from '../src/features';
import {selectExcerpt} from '../src/excerpt';
const generated = (hz = 440) => Float32Array.from({length: 3*RATE}, (_, i) => .2*Math.sin(2*Math.PI*hz*i/RATE));
// Only present on the clearly labelled software-fixture page, never main UI.
(window as unknown as {fixture: unknown}).fixture = {Classifier, Capture, decode, readRecord, writeRecord, generated, selectExcerpt};
