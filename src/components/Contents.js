import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import { formatText } from '../utils/format-text';

const CONTENT_LIST_ITEM_SHAPE = {
  children: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  title: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ContentsListItem = ({ id, listChildren, title }) => (
  <li>
    <a href={`#${id}`}>{formatText(title)}</a>
    {listChildren.length > 0 && <ContentsList listItems={listChildren} />}
  </li>
);

ContentsListItem.propTypes = {
  id: PropTypes.string.isRequired,
  listChildren: PropTypes.arrayOf(PropTypes.shape(CONTENT_LIST_ITEM_SHAPE)).isRequired,
  title: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ContentsList = ({ className, listItems }) => {
  return (
    <ul className={className}>
      {listItems.map(({ children, id, title }, index) => (
        <ContentsListItem key={index} listChildren={children} id={id} title={title} />
      ))}
    </ul>
  );
};

ContentsList.propTypes = {
  className: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.shape(CONTENT_LIST_ITEM_SHAPE)).isRequired,
};

ContentsList.defaultProps = {
  className: '',
};

const Contents = ({ nodeData: { argument, options }, page }) => {
  const maxDepth = typeof options.depth === 'undefined' ? Infinity : options.depth;

  const findSectionHeadings = (nodes, key, value) => {
    const results = [];
    const searchNode = (node, sectionDepth) => {
      if (node[key] === value && sectionDepth - 1 <= maxDepth && sectionDepth > 1) {
        const nodeTitle = node.children;
        const newNode = {
          children: [],
          depth: sectionDepth,
          id: node.id,
          title: nodeTitle,
        };
        const lastElement = results[results.length - 1];
        if (!lastElement || sectionDepth <= lastElement.depth) {
          results.push(newNode);
        } else {
          lastElement.children.push(newNode);
        }
      }
      // Don't include step headings in our TOC regardless of depth
      if (node.children && node.name !== 'step') {
        if (node.type === 'section') {
          sectionDepth += 1; // eslint-disable-line no-param-reassign
        }
        return node.children.forEach(child => searchNode(child, sectionDepth));
      }
      return null;
    };
    nodes.forEach(node => searchNode(node, 0));
    return results;
  };

  const displayText = getNestedValue([0, 'value'], argument);
  const headingNodes = findSectionHeadings(getNestedValue(['ast', 'children'], page), 'type', 'heading');
  return (
    <React.Fragment>
      {headingNodes.length > 0 && (
        <div className={['contents', 'topic', options.class, options.local ? 'local' : ''].join(' ')} id="on-this-page">
          <p className="topic-title first">{displayText}</p>
          <ContentsList className="simple" listItems={headingNodes} />
        </div>
      )}
    </React.Fragment>
  );
};

Contents.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      backlinks: PropTypes.oneOf(['none']),
      class: PropTypes.string,
      depth: PropTypes.number,
      local: PropTypes.bool,
    }),
  }).isRequired,
  page: PropTypes.shape({
    ast: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
  }).isRequired,
};

export default Contents;
