import React, { useEffect, useState } from 'react';
import {  BaseExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-fcss/dist/styles.css';

// Use components from Contentful's design system, Forma 36: https://ctfl.io/f36
import {
  Button,
} from '@contentful/forma-36-react-components';

export default function CopyButton({ sdk }: { sdk: BaseExtensionSDK }) {
  const [error, setError] = useState<string>();
  const [entryId, setEntryId] = useState<string|null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // TODO: TODO: validate if user has enough rights?
    console.log('Entry id =>', sdk.ids.entry);
    setEntryId(sdk.ids.entry)
  },[sdk.ids.entry]);

  useEffect(() => {
    if (!error) {
      return;
    }
    sdk.notifier.error(error);
  }, [error]);



  const initiateEnvSelection = async () => {
    const response = await sdk.dialogs.openCurrentApp({
      title: 'Select destination',
      parameters: { entryId }
    });
    console.log("dialog response env => ", response);
  }


  const onCopyPress = async () => {
    try {
      setLoading(true);
      initiateEnvSelection();
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
      <Button
        buttonType="positive"
        isFullWidth={true}
        onClick={onCopyPress}
        loading={isLoading}>
          Copy entry
      </Button>
  );
}
