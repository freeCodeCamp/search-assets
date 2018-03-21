import React from 'react';
import PropTypes from 'prop-types';
import { connectHighlight } from 'react-instantsearch/connectors';

// TODO: Shorten the highligh to max 144 chars

const ShortenedHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    attribute,
    hit,
    highlightProperty: '_highlightResult'
  });
  const highlightedHits = parsedHit.map((part, i) => {
    if (part.isHighlighted) {
      return (
        <mark key={`result-${hit.objectID}-${attribute}-${i}`}>
          {part.value}
        </mark>
      );
    }
    return part.value;
  });
  return <span key={`result-${hit.objectID}`}>{highlightedHits}</span>;
});

export const makeResult = (...attributes) => {
  const MadeResult = ({ hit }) => {
    const [title, body] = attributes;
    return (
      <div className="result-block">
        <h4>
          <ShortenedHighlight attribute={title} hit={hit} />
        </h4>
        <hr />
        <p>
          <ShortenedHighlight attribute={body} hit={hit} />
        </p>
      </div>
    );
  };
  MadeResult.displayName = 'MadeResult';
  MadeResult.propTypes = {
    hit: PropTypes.object
  };
  return MadeResult;
};
