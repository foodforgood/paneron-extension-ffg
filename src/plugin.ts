import { makeExtension } from '@riboseinc/paneron-extension-kit';
import 'electron';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "Food For Good",
  requiredHostAppVersion: '^2.0.0',
});
