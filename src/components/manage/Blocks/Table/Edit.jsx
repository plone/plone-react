/**
 * Edit text block.
 * @module components/manage/Blocks/Title/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map, remove } from 'lodash';
import { Button, Segment, Table, Form } from 'semantic-ui-react';
import { Portal } from 'react-portal';
import cx from 'classnames';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import Cell from '@plone/volto/components/manage/Blocks/Table/Cell';
import { Field, Icon } from '@plone/volto/components';

import rowBeforeSVG from '@plone/volto/icons/row-before.svg';
import rowAfterSVG from '@plone/volto/icons/row-after.svg';
import colBeforeSVG from '@plone/volto/icons/column-before.svg';
import colAfterSVG from '@plone/volto/icons/column-after.svg';
import rowDeleteSVG from '@plone/volto/icons/row-delete.svg';
import colDeleteSVG from '@plone/volto/icons/column-delete.svg';

import loadable from '@loadable/component';
const LibDraftJs = loadable.lib(() => import('draft-js'));

const getId = () => Math.floor(Math.random() * Math.pow(2, 24)).toString(32);

const valueToDraft = (value) => ({
  blocks: [
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: getId(),
      text: value,
      type: 'unstyled',
    },
  ],
  entityMap: {},
});

const emptyCell = (type) => ({
  key: getId(),
  type: type || 'data',
  value: valueToDraft(''),
});

const emptyRow = (cells) => ({
  key: getId(),
  cells: map(cells, () => emptyCell()),
});

const initialTable = () => ({
  fixed: true,
  compact: false,
  basic: false,
  celled: true,
  inverted: false,
  striped: false,
  rows: [
    {
      key: getId(),
      cells: [
        {
          key: getId(),
          type: 'header',
          value: valueToDraft(''),
        },
        {
          key: getId(),
          type: 'header',
          value: valueToDraft(''),
        },
      ],
    },
    {
      key: getId(),
      cells: [
        {
          key: getId(),
          type: 'data',
          value: valueToDraft(''),
        },
        {
          key: getId(),
          type: 'data',
          value: valueToDraft(''),
        },
      ],
    },
  ],
});

const messages = defineMessages({
  insertRowBefore: {
    id: 'Insert row before',
    defaultMessage: 'Insert row before',
  },
  insertRowAfter: {
    id: 'Insert row after',
    defaultMessage: 'Insert row after',
  },
  deleteRow: {
    id: 'Delete row',
    defaultMessage: 'Delete row',
  },
  insertColBefore: {
    id: 'Insert col before',
    defaultMessage: 'Insert col before',
  },
  insertColAfter: {
    id: 'Insert col after',
    defaultMessage: 'Insert col after',
  },
  deleteCol: {
    id: 'Delete col',
    defaultMessage: 'Delete col',
  },
  fixed: {
    id: 'Fixed width table cells',
    defaultMessage: 'Fixed width table cells',
  },
  compact: {
    id: 'Make the table compact',
    defaultMessage: 'Make the table compact',
  },
  basic: {
    id: 'Reduce complexity',
    defaultMessage: 'Reduce complexity',
  },
  celled: {
    id: 'Divide each row into separate cells',
    defaultMessage: 'Divide each row into separate cells',
  },
  inverted: {
    id: 'Table color inverted',
    defaultMessage: 'Table color inverted',
  },
  striped: {
    id: 'Stripe alternate rows with color',
    defaultMessage: 'Stripe alternate rows with color',
  },
  headerCell: {
    id: 'Header cell',
    defaultMessage: 'Header cell',
  },
});

/**
 * Edit text block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    detached: PropTypes.bool,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onMutateBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    detached: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        row: 0,
        cell: 0,
      },
      isClient: false,
    };
    this.onSelectCell = this.onSelectCell.bind(this);
    this.onInsertRowBefore = this.onInsertRowBefore.bind(this);
    this.onInsertRowAfter = this.onInsertRowAfter.bind(this);
    this.onInsertColBefore = this.onInsertColBefore.bind(this);
    this.onInsertColAfter = this.onInsertColAfter.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.onDeleteCol = this.onDeleteCol.bind(this);
    this.onChangeCell = this.onChangeCell.bind(this);
    this.toggleCellType = this.toggleCellType.bind(this);
    this.toggleBool = this.toggleBool.bind(this);
    this.toggleFixed = this.toggleFixed.bind(this);
    this.toggleCompact = this.toggleCompact.bind(this);
    this.toggleBasic = this.toggleBasic.bind(this);
    this.toggleCelled = this.toggleCelled.bind(this);
    this.toggleInverted = this.toggleInverted.bind(this);
    this.toggleStriped = this.toggleStriped.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.props.data.table) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        table: initialTable(),
      });
    }
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.data.table) {
      this.props.onChangeBlock(nextProps.block, {
        ...nextProps.data,
        table: initialTable(),
      });
    }
  }

  /**
   * Select cell handler
   * @method onSelectCell
   * @param {Number} row Row index.
   * @param {Number} cell Cell index.
   * @returns {undefined}
   */
  onSelectCell(row, cell) {
    this.setState({ selected: { row, cell } });
  }

  /**
   * Change cell handler
   * @method onChangeCell
   * @param {Number} row Row index.
   * @param {Number} cell Cell index.
   * @param {Object} editorState Editor state.
   * @returns {undefined}
   */
  onChangeCell = (row, cell, editorState) => {
    // onChangeCell gets called before the first render is
    // done so I put this if:
    if (!this.libDraftJsRef.current) {
      return;
    }

    const table = { ...this.props.data.table };
    table.rows[row].cells[cell].value = this.libDraftJsRef.current.convertToRaw(
      editorState.getCurrentContent(),
    );
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table,
    });
  };

  /**
   * Toggle cell type
   * @method toggleCellType
   * @returns {undefined}
   */
  toggleCellType() {
    const table = { ...this.props.data.table };
    let type =
      table.rows[this.state.selected.row].cells[this.state.selected.cell].type;
    table.rows[this.state.selected.row].cells[this.state.selected.cell].type =
      type === 'header' ? 'data' : 'header';
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table,
    });
  }

  /**
   * Insert row before handler
   * @method onInsertRowBefore
   * @returns {undefined}
   */
  onInsertRowBefore(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: [
          ...table.rows.slice(0, this.state.selected.row),
          emptyRow(table.rows[0].cells),
          ...table.rows.slice(this.state.selected.row),
        ],
      },
    });
    this.setState({
      selected: {
        row: this.state.selected.row + 1,
        cell: this.state.selected.cell,
      },
    });
  }

  /**
   * Insert row after handler
   * @method onInsertRowAfter
   * @returns {undefined}
   */
  onInsertRowAfter(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: [
          ...table.rows.slice(0, this.state.selected.row + 1),
          emptyRow(table.rows[0].cells),
          ...table.rows.slice(this.state.selected.row + 1),
        ],
      },
    });
  }

  /**
   * Insert col before handler
   * @method onInsertColBefore
   * @returns {undefined}
   */
  onInsertColBefore(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row, index) => ({
          ...row,
          cells: [
            ...row.cells.slice(0, this.state.selected.cell),
            emptyCell(table.rows[index].cells[this.state.selected.cell].type),
            ...row.cells.slice(this.state.selected.cell),
          ],
        })),
      },
    });
    this.setState({
      selected: {
        row: this.state.selected.row,
        cell: this.state.selected.cell + 1,
      },
    });
  }

  /**
   * Insert col after handler
   * @method onInsertColAfter
   * @returns {undefined}
   */
  onInsertColAfter(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row, index) => ({
          ...row,
          cells: [
            ...row.cells.slice(0, this.state.selected.cell + 1),
            emptyCell(table.rows[index].cells[this.state.selected.cell].type),
            ...row.cells.slice(this.state.selected.cell + 1),
          ],
        })),
      },
    });
  }

  /**
   * Delete col handler
   * @method onDeleteCol
   * @returns {undefined}
   */
  onDeleteCol(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;

    if (this.state.selected.cell === table.rows[0].cells.length - 1) {
      this.setState({
        selected: {
          row: this.state.selected.row,
          cell: this.state.selected.cell - 1,
        },
      });
    }

    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row) => ({
          ...row,
          cells: remove(
            row.cells,
            (cell, index) => index !== this.state.selected.cell,
          ),
        })),
      },
    });
  }

  /**
   * Delete row handler
   * @method onDeleteRow
   * @returns {undefined}
   */
  onDeleteRow(e) {
    e.preventDefault();
    e.stopPropagation();
    const table = this.props.data.table;

    if (this.state.selected.row === table.rows.length - 1) {
      this.setState({
        selected: {
          row: this.state.selected.row - 1,
          cell: this.state.selected.cell,
        },
      });
    }

    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: remove(
          table.rows,
          (row, index) => index !== this.state.selected.row,
        ),
      },
    });
  }

  /**
   * Toggle bool
   * @method toggleBool
   * @param {string} value Value to toggle.
   * @returns {undefined}
   */
  toggleBool(value) {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        [value]: !table[value],
      },
    });
  }

  /**
   * Toggle fixed
   * @method toggleFixed
   * @returns {undefined}
   */
  toggleFixed() {
    this.toggleBool('fixed');
  }

  /**
   * Toggle compact
   * @method toggleCompact
   * @returns {undefined}
   */
  toggleCompact() {
    this.toggleBool('compact');
  }

  /**
   * Toggle basic
   * @method toggleBasic
   * @returns {undefined}
   */
  toggleBasic() {
    this.toggleBool('basic');
  }

  /**
   * Toggle celled
   * @method toggleCelled
   * @returns {undefined}
   */
  toggleCelled() {
    this.toggleBool('celled');
  }

  /**
   * Toggle inverted
   * @method toggleInverted
   * @returns {undefined}
   */
  toggleInverted() {
    this.toggleBool('inverted');
  }

  /**
   * Toggle striped
   * @method toggleStriped
   * @returns {undefined}
   */
  toggleStriped() {
    this.toggleBool('striped');
  }

  libDraftJsRef = React.createRef();

  libDraftJsLoaded = (lib) => {
    this.libDraftJsRef.current = lib;
    this.checkLibs();
  };

  checkLibs = () => {
    if (!this.libDraftJsRef.current) {
      return;
    }

    // put here what should be done after all loadable libs are loaded
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (!this.state.isClient) {
      return <div />;
    }

    return (
      <>
        <LibDraftJs ref={this.libDraftJsLoaded} />
        <div className={cx('block table', { selected: this.props.selected })}>
          {this.props.selected && (
            <div className="toolbar">
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onInsertRowBefore}
                  title={this.props.intl.formatMessage(
                    messages.insertRowBefore,
                  )}
                  aria-label={this.props.intl.formatMessage(
                    messages.insertRowBefore,
                  )}
                >
                  <Icon name={rowBeforeSVG} size="24px" />
                </Button>
              </Button.Group>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onInsertRowAfter}
                  title={this.props.intl.formatMessage(messages.insertRowAfter)}
                  aria-label={this.props.intl.formatMessage(
                    messages.insertRowAfter,
                  )}
                >
                  <Icon name={rowAfterSVG} size="24px" />
                </Button>
              </Button.Group>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onDeleteRow}
                  disabled={
                    this.props.data.table &&
                    this.props.data.table.rows.length === 1
                  }
                  title={this.props.intl.formatMessage(messages.deleteRow)}
                  aria-label={this.props.intl.formatMessage(messages.deleteRow)}
                >
                  <Icon name={rowDeleteSVG} size="24px" />
                </Button>
              </Button.Group>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onInsertColBefore}
                  title={this.props.intl.formatMessage(
                    messages.insertColBefore,
                  )}
                  aria-label={this.props.intl.formatMessage(
                    messages.insertColBefore,
                  )}
                >
                  <Icon name={colBeforeSVG} size="24px" />
                </Button>
              </Button.Group>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onInsertColAfter}
                  title={this.props.intl.formatMessage(messages.insertColAfter)}
                  aria-label={this.props.intl.formatMessage(
                    messages.insertColAfter,
                  )}
                >
                  <Icon name={colAfterSVG} size="24px" />
                </Button>
              </Button.Group>
              <Button.Group>
                <Button
                  icon
                  basic
                  onClick={this.onDeleteCol}
                  disabled={
                    this.props.data.table &&
                    this.props.data.table.rows[0].cells.length === 1
                  }
                  title={this.props.intl.formatMessage(messages.deleteCol)}
                  aria-label={this.props.intl.formatMessage(messages.deleteCol)}
                >
                  <Icon name={colDeleteSVG} size="24px" />
                </Button>
              </Button.Group>
            </div>
          )}
          {this.props.data.table && (
            <Table
              fixed={this.props.data.table.fixed}
              compact={this.props.data.table.compact}
              basic={this.props.data.table.basic ? 'very' : false}
              celled={this.props.data.table.celled}
              inverted={this.props.data.table.inverted}
              striped={this.props.data.table.striped}
            >
              <Table.Body>
                {map(this.props.data.table.rows, (row, rowIndex) => (
                  <Table.Row key={row.key}>
                    {map(row.cells, (cell, cellIndex) => (
                      <Table.Cell
                        key={cell.key}
                        as={cell.type === 'header' ? 'th' : 'td'}
                        className={
                          rowIndex === this.state.selected.row &&
                          cellIndex === this.state.selected.cell &&
                          this.props.selected
                            ? 'selected'
                            : ''
                        }
                      >
                        <Cell
                          value={cell.value}
                          row={rowIndex}
                          cell={cellIndex}
                          onSelectCell={this.onSelectCell}
                          selected={
                            rowIndex === this.state.selected.row &&
                            cellIndex === this.state.selected.cell
                          }
                          isTableBlockSelected={this.props.selected}
                          onAddBlock={this.props.onAddBlock}
                          onSelectBlock={this.props.onSelectBlock}
                          onChange={this.onChangeCell}
                          index={this.props.index}
                          disableNewBlocks={this.props.data?.disableNewBlocks}
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          {this.props.selected && this.state.isClient && (
            <Portal node={document.getElementById('sidebar-properties')}>
              <Form
                method="post"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <Segment secondary attached>
                  <FormattedMessage id="Table" defaultMessage="Table" />
                </Segment>
                <Segment attached>
                  <Field
                    id="fixed"
                    title={this.props.intl.formatMessage(messages.fixed)}
                    type="boolean"
                    value={this.props.data.table && this.props.data.table.fixed}
                    onChange={() => this.toggleFixed()}
                  />
                  <Field
                    id="celled"
                    title={this.props.intl.formatMessage(messages.celled)}
                    type="boolean"
                    value={
                      this.props.data.table && this.props.data.table.celled
                    }
                    onChange={this.toggleCelled}
                  />
                  <Field
                    id="striped"
                    title={this.props.intl.formatMessage(messages.striped)}
                    type="boolean"
                    value={
                      this.props.data.table && this.props.data.table.striped
                    }
                    onChange={this.toggleStriped}
                  />
                  <Field
                    id="compact"
                    title={this.props.intl.formatMessage(messages.compact)}
                    type="boolean"
                    value={
                      this.props.data.table && this.props.data.table.compact
                    }
                    onChange={() => this.toggleCompact()}
                  />
                  <Field
                    id="basic"
                    title={this.props.intl.formatMessage(messages.basic)}
                    type="boolean"
                    value={this.props.data.table && this.props.data.table.basic}
                    onChange={this.toggleBasic}
                  />
                  <Field
                    id="inverted"
                    title={this.props.intl.formatMessage(messages.inverted)}
                    type="boolean"
                    value={
                      this.props.data.table && this.props.data.table.inverted
                    }
                    onChange={this.toggleInverted}
                  />
                </Segment>
                <Segment secondary attached>
                  <FormattedMessage id="Cell" defaultMessage="Cell" />
                </Segment>
                <Segment attached>
                  <Field
                    id="celltype"
                    title={this.props.intl.formatMessage(messages.headerCell)}
                    type="boolean"
                    value={
                      this.props.data.table &&
                      this.props.data.table.rows[this.state.selected.row].cells[
                        this.state.selected.cell
                      ].type === 'header'
                    }
                    onChange={this.toggleCellType}
                  />
                </Segment>
              </Form>
            </Portal>
          )}
        </div>
      </>
    );
  }
}

export default injectIntl(Edit);
