import blueprintInit from './utils/blueprintInit';
import blueprintSetup from './utils/blueprintSetup';

const blueprint = (appBlueprint, options) => {
  const bpInit = blueprintInit(appBlueprint);
  return blueprintSetup(bpInit, appBlueprint, options);
};

export default blueprint;
