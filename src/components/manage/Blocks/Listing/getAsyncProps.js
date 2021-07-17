import { getQueryStringResults } from '@plone/volto/actions';

export default ({ dispatch, data, path }) => {
  return [
    dispatch(
      getQueryStringResults(path, { ...data, fullobjects: 1 }, data.block),
    ),
  ];
};
