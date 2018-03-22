import React from 'react';
import isEmpty from 'lodash/isEmpty';
import SearchHits from '../components/SearchHits';

function getDataset(node, count = 0) {
  const nodeEmpty = isEmpty(node.dataset);
  if (count === 4) {
    return nodeEmpty ? null : node.dataset;
  }
  if (isEmpty(node.dataset)) {
    return getDataset(node.parentElement, count++);
  }
  return node.dataset;
}

function openBlankWindow(url) {
  return window.open(url, '_blank');
}

const indexUrlMap = {
  challenges: 'https://learn.freecodecamp.org',
  guides: 'https://guide.freecodecamp.org',
  youtube: 'https://www.youtube.com/watch?v='
};

function handleClick(e) {
  e.preventDefault();
  const node = e.target;
  const dataset = getDataset(node);
  if (!dataset) {
    console.warn('expected a dataset, got %s', dataset);
    return null;
  }
  const { fccContentIndex: index, fccContentUrl: splat } = dataset;
  const url = `${indexUrlMap[index]}${splat}`;
  return openBlankWindow(url);
}

// const IndexPage = () => <SearchHits handleClick={handleClick} />;
const IndexPage = () => <p>Hello from the IndexPage</p>;

export default IndexPage;
