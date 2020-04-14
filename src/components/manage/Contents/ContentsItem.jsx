/**
 * Contents item component.
 * @module components/manage/Contents/ContentsItem
 */

import React from 'react';
import { Table, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import moment from 'moment';
import { DragSource, DropTarget } from 'react-dnd';
import { FormattedMessage } from 'react-intl';
import { Icon, Circle } from '@plone/volto/components';
import moreSVG from '@plone/volto/icons/more.svg';
import addDocumentSVG from '@plone/volto/icons/add-document.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import fileSVG from '@plone/volto/icons/file.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import checkboxUncheckedSVG from '@plone/volto/icons/checkbox-unchecked.svg';
import checkboxCheckedSVG from '@plone/volto/icons/checkbox-checked.svg';
import cutSVG from '@plone/volto/icons/cut.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import copySVG from '@plone/volto/icons/copy.svg';
import showSVG from '@plone/volto/icons/show.svg';
import moveUpSVG from '@plone/volto/icons/move-up.svg';
import moveDownSVG from '@plone/volto/icons/move-down.svg';
import editingSVG from '@plone/volto/icons/editing.svg';
import dragSVG from '@plone/volto/icons/drag.svg';

export function getIcon(type, isFolderish) {
  switch (type) {
    case 'Document':
      return addDocumentSVG;
    case 'Image':
      return imageSVG;
    case 'File':
      return fileSVG;
    case 'Link':
      return linkSVG;
    case 'Event':
      return calendarSVG;
    default:
      return isFolderish ? folderSVG : fileSVG;
  }
}

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColor(string) {
  switch (string) {
    case 'private':
      return '#ed4033';
    case 'published':
      return '#007bc1';
    case 'intranet':
      return '#51aa55';
    default:
      return '#f6a808';
  }
}

/**
 * Contents item component class.
 * @function ContentsItemComponent
 * @returns {string} Markup of the component.
 */
export const ContentsItemComponent = ({
  item,
  selected,
  onClick,
  indexes,
  onCut,
  onCopy,
  onDelete,
  onMoveToTop,
  onMoveToBottom,
  connectDragPreview,
  connectDragSource,
  connectDropTarget,
  isDragging,
  order,
}) =>
  connectDropTarget(
    connectDragPreview(
      <tr key={item['@id']} style={{ opacity: isDragging ? 0 : 1 }}>
        <Table.Cell>
          {connectDragSource(
            <div>
              <Icon
                name={dragSVG}
                size="20px"
                color="#878f93"
                className="content drag handle"
              />
            </div>,
          )}
        </Table.Cell>
        <Table.Cell>
          {selected ? (
            <Icon
              name={checkboxCheckedSVG}
              color="#007eb1"
              size="20px"
              className="checked"
              onClick={e => onClick(e, item['@id'])}
            />
          ) : (
            <Icon
              name={checkboxUncheckedSVG}
              color="#826a6a"
              size="20px"
              className="unchecked"
              onClick={e => onClick(e, item['@id'])}
            />
          )}
        </Table.Cell>
        <Table.Cell>
          <Link to={`${item['@id']}${item.is_folderish ? '/contents' : ''}`}>
            <Icon
              name={getIcon(item['@type'], item.is_folderish)}
              size="12px"
            />{' '}
            {item.title}
          </Link>
        </Table.Cell>
        {map(indexes, index => (
          <Table.Cell key={index.id}>
            {index.type === 'boolean' &&
              (item[index.id] ? (
                <FormattedMessage id="Yes" defaultMessage="Yes" />
              ) : (
                <FormattedMessage id="No" defaultMessage="No" />
              ))}
            {index.type === 'string' &&
              index.id !== 'review_state' &&
              item[index.id]}
            {index.id === 'review_state' && (
              <div>
                <span>
                  <Circle color={getColor(item[index.id])} size="15px" />
                </span>
                {item[index.id] ? capitalise(item[index.id]) : null}
              </div>
            )}
            {index.type === 'date' && (
              <span
                title={
                  item[index.id] !== 'None' ? (
                    moment(item[index.id]).format('LLLL')
                  ) : (
                    <FormattedMessage id="None" defaultMessage="None" />
                  )
                }
              >
                {item[index.id] !== 'None' ? (
                  moment(item[index.id]).fromNow()
                ) : (
                  <FormattedMessage id="None" defaultMessage="None" />
                )}
              </span>
            )}
          </Table.Cell>
        ))}
        <Table.Cell textAlign="right">
          <Dropdown icon={<Icon name={moreSVG} size="24px" color="#007eb1" />}>
            <Dropdown.Menu className="left">
              <Link className="item" to={`${item['@id']}/edit`}>
                <Icon name={editingSVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage id="Edit" defaultMessage="Edit" />
              </Link>
              <Link className="item" to={item['@id']}>
                <Icon name={showSVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage id="View" defaultMessage="View" />
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onCut} value={item['@id']}>
                <Icon name={cutSVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage id="Cut" defaultMessage="Cut" />
              </Dropdown.Item>
              <Dropdown.Item onClick={onCopy} value={item['@id']}>
                <Icon name={copySVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage id="Copy" defaultMessage="Copy" />
              </Dropdown.Item>
              <Dropdown.Item onClick={onDelete} value={item['@id']}>
                <Icon name={deleteSVG} color="#e40166" size="24px" />{' '}
                <FormattedMessage id="Delete" defaultMessage="Delete" />
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onMoveToTop} value={order}>
                <Icon name={moveUpSVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage
                  id="Move to top of folder"
                  defaultMessage="Move to top of folder"
                />
              </Dropdown.Item>
              <Dropdown.Item onClick={onMoveToBottom} value={order}>
                <Icon name={moveDownSVG} color="#007eb1" size="24px" />{' '}
                <FormattedMessage
                  id="Move to bottom of folder"
                  defaultMessage="Move to bottom of folder"
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Table.Cell>
      </tr>,
    ),
  );

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ContentsItemComponent.propTypes = {
  item: PropTypes.shape({
    '@id': PropTypes.string,
    title: PropTypes.string,
    is_folderish: PropTypes.bool,
    '@type': PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  indexes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
    }),
  ).isRequired,
  onCut: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveToTop: PropTypes.func.isRequired,
  onMoveToBottom: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  onOrderItem: PropTypes.func.isRequired,
};

export default DropTarget(
  'item',
  {
    hover(props, monitor) {
      const id = monitor.getItem().id;
      const dragOrder = monitor.getItem().order;
      const hoverOrder = props.order;

      if (dragOrder === hoverOrder) {
        return;
      }

      props.onOrderItem(id, dragOrder, hoverOrder - dragOrder, false);

      monitor.getItem().order = hoverOrder;
    },
    drop(props, monitor) {
      const id = monitor.getItem().id;
      const dragOrder = monitor.getItem().startOrder;
      const dropOrder = props.order;

      if (dragOrder === dropOrder) {
        return;
      }

      props.onOrderItem(id, dragOrder, dropOrder - dragOrder, true);

      monitor.getItem().order = dropOrder;
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  }),
)(
  DragSource(
    'item',
    {
      beginDrag(props) {
        return {
          id: props.item['@id'],
          order: props.order,
          startOrder: props.order,
        };
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }),
  )(ContentsItemComponent),
);
