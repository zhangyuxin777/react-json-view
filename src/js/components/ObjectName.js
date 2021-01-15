import React from 'react';
import Theme from './../themes/getStyle';

export default function getObjectName(props) {
  const {
    parent_type, namespace, theme, jsvRoot, name, quot
  } = props;

  const display_name = props.name ? props.name : '';

  if (jsvRoot && (name === false || name === null)) {
    return (<span />);
  } else if (parent_type == 'array') {
    return (
      <span {...Theme(theme, 'array-key')} key={namespace}>
        <span className="array-key">{display_name}</span>
        <span {...Theme(theme, 'colon')}>:</span>
      </span>
    );
  }
  return (
    <span {...Theme(theme, 'object-name')} key={namespace}>
      <span className="object-key">
        {
          quot && <span style={{ verticalAlign: 'top' }}>&quot;</span>
        }
        <span>{display_name}</span>
        {
          quot && <span style={{ verticalAlign: 'top' }}>&quot;</span>
        }
      </span>
      <span {...Theme(theme, 'colon')}>:</span>
    </span>
  );
}
