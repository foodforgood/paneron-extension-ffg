import { makeExtension } from '@riboseinc/paneron-extension-kit';
import 'electron';

export default makeExtension({
  mainView: () => import('./RepoView'),
  name: "Food For Good",
  requiredHostAppVersion: '^1.0.0-beta23',
});
