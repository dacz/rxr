import Rx from 'rxjs';

// Separated because it may be constructed differenty in the future
const createActionStream = () => new Rx.Subject;

export default createActionStream;
