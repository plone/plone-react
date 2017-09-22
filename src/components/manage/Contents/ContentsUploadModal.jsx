/**
 * Contents upload modal.
 * @module components/manage/Contents/ContentsUploadModal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Dimmer,
  Header,
  Icon,
  Image,
  Loader,
  Modal,
  Table,
  Segment,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { concat, filter, map } from 'lodash';
import moment from 'moment';
import filesize from 'filesize';
import { readAsDataURL } from 'promise-file-reader';
import { FormattedMessage } from 'react-intl';

import { addContent } from '../../../actions';

/**
 * ContentsUploadModal class.
 * @class ContentsUploadModal
 * @extends Component
 */
@connect(
  state => ({
    request: state.content.add,
  }),
  dispatch => bindActionCreators({ addContent }, dispatch),
)
export default class ContentsUploadModal extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    addContent: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ContentsUploadModal
   */
  constructor(props) {
    super(props);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      files: [],
    };
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * 
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.request.loading && nextProps.request.loaded) {
      this.props.onOk();
      this.setState({
        files: [],
      });
    }
  }

  /**
   * Remove file handler
   * @method onRemoveFile
   * @param {Object} event Event object
   * 
   */
  onRemoveFile(event) {
    this.setState({
      files: filter(
        this.state.files,
        (file, index) =>
          index !== parseInt(event.target.getAttribute('value'), 10),
      ),
    });
  }

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * 
   */
  onDrop(files) {
    this.setState({
      files: concat(this.state.files, files),
    });
  }

  /**
   * Cancel handler
   * @method onCancel
   * 
   */
  onCancel() {
    this.props.onCancel();
    this.setState({
      files: [],
    });
  }

  /**
   * Submit handler
   * @method onSubmit
   * 
   */
  onSubmit() {
    Promise.all(
      map(this.state.files, file => readAsDataURL(file)),
    ).then(files => {
      this.props.addContent(
        this.props.pathname,
        map(this.state.files, (file, index) => {
          const fields = files[index].match(/^data:(.*);(.*),(.*)$/);
          const image = fields[1].split('/')[0] === 'image';
          return {
            '@type': image ? 'Image' : 'File',
            title: file.name,
            [image ? 'image' : 'file']: {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            },
          };
        }),
      );
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      this.props.open && (
        <Modal open={this.props.open}>
          <Header>
            <FormattedMessage id="Upload files" defaultMessage="Upload files" />
          </Header>
          <Dimmer active={this.props.request.loading}>
            <Loader>
              <FormattedMessage
                id="Uploading files"
                defaultMessage="Uploading files"
              />
            </Loader>
          </Dimmer>
          <Modal.Content>
            <Dropzone onDrop={this.onDrop} className="dropzone">
              <Segment className="dashed">
                <Table basic="very">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <FormattedMessage
                          id="Drag and drop files from your computer onto this area or click the “Browse” button."
                          defaultMessage="Drag and drop files from your computer onto this area or click the “Browse” button."
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary floated="right">
                          <FormattedMessage
                            id="Browse"
                            defaultMessage="Browse"
                          />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Segment>
            </Dropzone>
            {this.state.files.length > 0 && (
              <Table compact singleLine>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={8}>
                      <FormattedMessage
                        id="Filename"
                        defaultMessage="Filename"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell width={4}>
                      <FormattedMessage
                        id="Last modified"
                        defaultMessage="Last modified"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell width={4}>
                      <FormattedMessage
                        id="File size"
                        defaultMessage="File size"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell width={4}>
                      <FormattedMessage id="Preview" defaultMessage="Preview" />
                    </Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {map(this.state.files, (file, index) => (
                    <Table.Row key={file.name}>
                      <Table.Cell>{file.name}</Table.Cell>
                      <Table.Cell>
                        {moment(file.lastModifiedDate).fromNow()}
                      </Table.Cell>
                      <Table.Cell>
                        {filesize(file.size, { round: 0 })}
                      </Table.Cell>
                      <Table.Cell>
                        {file.type.split('/')[0] === 'image' ? (
                          <Image src={file.preview} height={60} />
                        ) : (
                          <Image src="//:0" height={60} />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Icon
                          name="close"
                          value={index}
                          link
                          onClick={this.onRemoveFile}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Modal.Content>
          <Modal.Actions>
            {this.state.files.length > 0 && (
              <Button primary onClick={this.onSubmit}>
                <FormattedMessage
                  id="Upload {count, plural, one {# file} other {# files}}"
                  defaultMessage="Upload {count, plural, one {# file} other {# files}}"
                  values={{
                    count: this.state.files.length,
                  }}
                />
              </Button>
            )}
            <Button onClick={this.onCancel}>
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
          </Modal.Actions>
        </Modal>
      )
    );
  }
}
