import React, { useEffect, useState } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as R from 'ramda';
// Use components from Contentful's design system, Forma 36: https://ctfl.io/f36
import { TextField } from '@contentful/forma-36-react-components';

interface State {
  url: string;
}

export default function Config({ sdk }: { sdk: AppExtensionSDK }) {
  const [getEnvUrl, setGetEnvUrl] = useState('');
  const [copyEntryUrl, setCopyEntryUrl] = useState('');

  const configure = () => {
    return {
      // Parameters to be persisted as the app configuration.
      parameters: { getEnvironmentsUrl: getEnvUrl || '', copyEntryUrl },
    };
  };

  const onGetEnvUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setGetEnvUrl(updatedValue);
  };

  const onCopyEntryUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setCopyEntryUrl(updatedValue);
  };

  useEffect(() => {
    sdk.app.onConfigure(configure);
  }, [getEnvUrl, copyEntryUrl]);

  useEffect(() => {
    // Ready to display our app (end loading state).
    sdk.app.getParameters().then((parameters) => {
      const getEnv = (R.propOr('', 'getEnvironmentsUrl', parameters || {}) as unknown) as string;
      const copyEntry = (R.propOr('', 'copyEntryUrl', parameters || {}) as unknown) as string;
      setGetEnvUrl(getEnv);
      setCopyEntryUrl(copyEntry);
      sdk.app.setReady();
    });
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <TextField
        name="urlInput"
        id="urlInput"
        value={getEnvUrl}
        onChange={onGetEnvUrlChange}
        labelText="Endpoint url for getting all contentful environments ids"></TextField>
      <div style={{ margin: 50 }} />

      <TextField
        name="urlInput"
        id="urlInput"
        value={copyEntryUrl}
        onChange={onCopyEntryUrlChange}
        labelText="Endpoint url for copy/paste"></TextField>
    </div>
  );
}
