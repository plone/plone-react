import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { Button, Segment } from 'semantic-ui-react';
import { isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';

import { getSlots, saveSlot } from '@plone/volto/actions';
import BlocksForm from '@plone/volto/components/manage/Blocks/Block/BlocksForm';
import {
  getBlocks,
  emptyBlocksForm,
  Helmet,
  getBaseUrl,
  slotsBlocksConfig,
  blockHasValue,
  cleanupLastPlaceholders,
} from '@plone/volto/helpers';
import { InlineForm, Icon, Sidebar, Toolbar } from '@plone/volto/components';
import SlotEditBlockWrapper from './SlotEditBlockWrapper';
import SlotSchema from './schema';

import config from '@plone/volto/registry';

import saveSVG from '@plone/volto/icons/save.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
});

/**
 * Given a blocks form, adds an empty placeholder block is none exists
 */
function addPlaceholderBlock(formData) {
  const blocks = getBlocks(formData || {});

  const emptyBlocks = blocks
    .filter(([, block]) => !blockHasValue(block))
    .map(([id]) => id);
  const readOnlyBlocks = blocks
    .filter(([, block]) => block.readOnly)
    .map(([id]) => id);

  const hasPlaceholder = !!emptyBlocks.find(
    (b) => readOnlyBlocks.indexOf(b) === -1,
  );

  const id = uuid();

  return hasPlaceholder
    ? formData
    : {
        ...formData,
        blocks: {
          ...(formData.blocks || {}),
          [id]: {
            '@type': config.settings.defaultBlockType,
          },
        },
        blocks_layout: {
          ...(formData.blocks_layout || []),
          items: [...(formData.blocks_layout?.items || []), id],
        },
      };
}

class EditSlot extends React.Component {
  constructor(props) {
    super(props);

    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getInitialData = this.getInitialData.bind(this);

    const data = this.getInitialData(this.props);

    this.state = {
      isClient: false,
      selectedBlock: data.blocks_layout.items[0],
      data,
    };

    // special variable, needed to support blocks that rely on `onChangeBlock`
    // API to change the whole blocks + layout of the form
    this.blocksState = {};
  }

  getInitialData(props) {
    const { slotData = {} } = props;

    return addPlaceholderBlock(slotData);
  }

  componentDidMount() {
    this.setState({ isClient: true });
    this.props.getSlots(getBaseUrl(this.props.pathname), { full: true });
  }

  componentDidUpdate(prevProps) {
    const blocks = getBlocks(this.state.data);
    if (!blocks.length) {
      this.setState({ data: emptyBlocksForm() });
    }

    if (!isEqual(prevProps.slotData, this.props.slotData)) {
      this.setState({
        data: { ...this.state.data, ...this.getInitialData(this.props) },
      });
    }
  }

  onCancel() {
    this.props.history.push(getBaseUrl(this.props.pathname));
  }

  onSave() {
    const { saveSlot, pathname, slotId } = this.props;
    let { data } = this.state;
    const cleanData = cleanupLastPlaceholders(data);

    saveSlot(getBaseUrl(pathname), slotId, cleanData).then(() => {
      this.props.history.push(getBaseUrl(this.props.pathname));
    });
  }

  render() {
    const { pathname, content } = this.props;
    const { data, selectedBlock, isClient } = this.state;
    const blocksConfig = slotsBlocksConfig(config.blocks.blocksConfig);
    const title = config.slots[this.props.slotId]?.title || this.props.slotId;

    return (
      <div id="slot-edit">
        <Helmet title={`Edit slot: ${title}`} />
        {isClient && (
          <div className="ui container">
            <BlocksForm
              pathname={pathname}
              onChangeField={(id, value) => {
                if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
                  this.blocksState[id] = value;
                  this.setState({
                    data: {
                      ...data,
                      ...this.blocksState,
                      [id]: value,
                    },
                  });
                }
              }}
              onChangeFormData={(data) => this.setState({ data })}
              onSelectBlock={(id) => this.setState({ selectedBlock: id })}
              selectedBlock={selectedBlock}
              title="Edit slot"
              metadata={content}
              properties={data}
              blocksConfig={blocksConfig}
              isMainForm
            >
              {({ draginfo }, editBlock, blockProps) => (
                <SlotEditBlockWrapper
                  draginfo={draginfo}
                  blockProps={blockProps}
                >
                  {editBlock}
                </SlotEditBlockWrapper>
              )}
            </BlocksForm>
            <Portal node={document.getElementById('toolbar')}>
              <Toolbar
                pathname={this.props.pathname}
                hideDefaultViewButtons
                activity="edit"
                inner={
                  <>
                    <Button
                      id="toolbar-save"
                      className="save"
                      aria-label={this.props.intl.formatMessage(messages.save)}
                      onClick={this.onSave}
                      disabled={this.props.updateRequest.loading}
                      loading={this.props.updateRequest.loading}
                    >
                      <Icon
                        name={saveSVG}
                        className="circled"
                        size="30px"
                        title={this.props.intl.formatMessage(messages.save)}
                      />
                    </Button>
                    <Button
                      className="cancel"
                      aria-label={this.props.intl.formatMessage(
                        messages.cancel,
                      )}
                      onClick={this.onCancel}
                    >
                      <Icon
                        name={clearSVG}
                        className="circled"
                        size="30px"
                        title={this.props.intl.formatMessage(messages.cancel)}
                      />
                    </Button>
                  </>
                }
              />
            </Portal>
            <Portal node={document.getElementById('sidebar')}>
              <Sidebar documentTab={false} settingsTab={true} />
            </Portal>
            <Portal node={document.getElementById('sidebar-settings')}>
              <div>
                <InlineForm
                  schema={SlotSchema(this.props)}
                  formData={data}
                  onChangeField={(id, value) =>
                    this.setState({
                      data: {
                        ...data,
                        [id]: value,
                      },
                    })
                  }
                />
                {false && (
                  <Segment>
                    <fieldset>
                      <legend>Block color legend</legend>
                      <div className="block">
                        <div className="block selected">Regular slot fill</div>
                      </div>
                    </fieldset>
                  </Segment>
                )}
              </div>
            </Portal>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => {
      const slotId = props.match.params.id;
      return {
        slotId,
        pathname: props.location.pathname,
        content: state.content.data,
        updateRequest: state.slots?.patch || {},
        slotData: state.slots.data?.items?.[slotId],
      };
    },
    {
      saveSlot,
      getSlots,
    },
  ),
)(EditSlot);
