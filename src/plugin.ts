import { makeExtension } from '@riboseinc/paneron-extension-kit';
import RepoView from './RepoView';

export default makeExtension({
  mainView: RepoView,
  name: "Food For Good",
  requiredHostAppVersion: '^2.2.0',
});
