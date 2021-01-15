import React from 'react';
import dispatcher from './../helpers/dispatcher';
import ObjectAttributes from './../stores/ObjectAttributes';

import CopyToClipboard from './CopyToClipboard';
import { toType } from './../helpers/util';

// icons
import { RemoveCircle as Remove, AddCircle as Add } from './icons';

// theme
import Theme from './../themes/getStyle';


export default class extends React.PureComponent {
  getObjectSize = () => {
    const { size, theme, displayObjectSize } = this.props;
    if (displayObjectSize) {
      return (
        <span
          className="object-size"
          {...Theme(theme, 'object-size')}
        >
          {size} item{size === 1 ? '' : 's'}
        </span>
      );
    }
  };


  getAddAttribute = () => {
    const {
      theme, namespace, name, src, rjvId, depth
    } = this.props;

    return (
      <span
        className="click-to-add"
        style={{ verticalAlign: 'top' }}
      >
        <Add
          className="click-to-add-icon"
          {...Theme(theme, 'addVarIcon')}
          onClick={() => {
            const request = {
              name: depth > 0 ? name : null,
              namespace: namespace.splice(0, (namespace.length - 1)),
              existing_value: src,
              variable_removed: false,
              key_name: null
            };
            if (toType(src) === 'object') {
              dispatcher.dispatch({
                name: 'ADD_VARIABLE_KEY_REQUEST',
                rjvId,
                data: request,
              });
            } else {
              dispatcher.dispatch({
                name: 'VARIABLE_ADDED',
                rjvId,
                data: {
                  ...request,
                  new_value: [...src, null]
                }
              });
            }
          }}
        />
      </span>
    );
  };

  renderCustom = () => {
    const {
      renderCustomDom, namespace, name, src, rjvId, depth
    } = this.props;
    const onAdd = ({ key, value }) => {
      const request = {
        name: depth > 0 ? name : null,
        namespace: namespace.splice(0, (namespace.length - 1)),
        existing_value: src,
        variable_removed: false,
        key_name: null,
        new_value: {}
      };
      dispatcher.dispatch({
        name: 'VARIABLE_CUSTOM_ADDED',
        rjvId,
        data: {
          ...request,
          new_value: {
            ...src,
            [key]: { ...value }
          }
        }
      });
    };

    const onUpdate = ({ value }) => {
      dispatcher.dispatch({
        name: 'VARIABLE_CUSTOM_UPDATED',
        rjvId,
        data: {
          name,
          namespace: namespace.splice(0, (namespace.length - 1)),
          existing_value: src,
          new_value: value,
          variable_removed: false
        }
      });
    };

    const onRemove = () => {
      dispatcher.dispatch({
        name: 'VARIABLE_CUSTOM_REMOVED',
        rjvId,
        data: {
          name,
          namespace: namespace.splice(0, (namespace.length - 1)),
          existing_value: src,
          variable_removed: true
        },
      });
    };

    const custom = renderCustomDom ? (
      <span className="click-to-add">
        {
          renderCustomDom({
            onRemove,
            onAdd,
            onUpdate,
            src,
            name
          })
        }
      </span>) : null;

    return custom;
  };

  getRemoveObject = () => {
    const {
      theme, namespace, name, src, rjvId
    } = this.props;

    // don't allow deleting of root node
    if (namespace.length === 1) {
      return;
    }
    return (
      <span className="click-to-remove">
        <Remove
          className="click-to-remove-icon"
          {...Theme(theme, 'removeVarIcon')}
          onClick={() => {
            dispatcher.dispatch({
              name: 'VARIABLE_REMOVED',
              rjvId,
              data: {
                name,
                namespace: namespace.splice(0, (namespace.length - 1)),
                existing_value: src,
                variable_removed: true
              },
            });
          }}
        />
      </span>
    );
  };

  render = () => {
    const {
      theme,
      onDelete,
      onAdd,
      enableClipboard,
      src,
      namespace,
    } = this.props;
    return (
      <div
        {...Theme(theme, 'object-meta-data')}
        className="object-meta-data"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* size badge display */}
        {this.getObjectSize()}
        {/* copy to clipboard icon */}
        {enableClipboard
          ? (<CopyToClipboard
            clickCallback={enableClipboard}
            {...{
              src,
              theme,
              namespace
            }}
          />)
          : null
        }
        {/* copy add/remove icons */}
        {onAdd !== false ? this.getAddAttribute() : null}
        {onDelete !== false ? this.getRemoveObject() : null}
        {this.renderCustom()}
      </div>
    );
  };
}
