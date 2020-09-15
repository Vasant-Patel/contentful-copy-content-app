import React, { useEffect, useState, ChangeEvent } from 'react';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import * as R from 'ramda';
import axios from 'axios';
import { Button, Option, SelectField } from '@contentful/forma-36-react-components';

interface State {
  url: string;
}

export default function Dialog({ sdk }: { sdk: DialogExtensionSDK }) {
  const [targetEnv, setTargetEnv] = useState<string | undefined>();
  const [entryId, setEntryId] = useState<string | undefined>();
  const [environments, setEnvironments] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  // backend api's ---------
  const loadEnvironments = () => {
    const endpointUrl = (R.propOr(
      null,
      'getEnvironmentsUrl',
      sdk.parameters.installation
    ) as unknown) as string;

    if (!endpointUrl) {
      throw 'Please set valid endpoint url from Manage Apps => Configure';
    }

    setLoading(true);
    axios
      .get(endpointUrl, {
        params: {
          entryId: entryId,
          sourceEnv: sdk.ids.environment,
        },
      })
      .then((r) => r.data as string[])
      .then((r) => setEnvironments(r))
      .catch(e => setError(e.messsage || e))
      .finally(() => {
        setLoading(false);
      });
  };


  console.log('SDK in dialog => ', sdk);
  const onSelectionChange = (e: ChangeEvent) => {
    console.log('Env selected =>', e.target.value);
    setTargetEnv(e.target.value);
  };

  useEffect(() => {
    // Ready to display our app (end loading state).
    loadEnvironments();
    const entryId = (R.propOr(
      null,
      'entryId',
      sdk.parameters.invocation || {}
    ) as unknown) as string;
    setEntryId(entryId);
    sdk.window.updateHeight();
  }, []);

  useEffect(() => {
    console.log("Error : ", error)
    if (error) {
      sdk.notifier.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (environments.length) {
      setTargetEnv(R.head(environments))
    }
  }, [environments]);

  const onCopyPress = () => {
    const endpointUrl = (R.propOr(
      null,
      'copyEntryUrl',
      sdk.parameters.installation
    ) as unknown) as string;

    if (!endpointUrl) {
      throw 'Please set valid endpoint url from Manage Apps => Configure';
    }

    setLoading(true);
    axios
    .get(endpointUrl, {
      params: {
        entryId: entryId,
        sourceEnv: sdk.ids.environment,
        targetEnv,
      },
    })
    .then((r) => r.data as string[])
    .then(_ => sdk.notifier.success("Entry copied/updated successfully!"))
    .catch(e => setError(e.messsage || e))
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div style={{ margin: 50 }}>
      <SelectField
        required={true}
        name="optionSelect"
        id="optionSelect"
        labelText="Select copy destination environment or ALL for copying to all environments"
        value={targetEnv || ''}
        onChange={onSelectionChange}
        helpText="This function allows you to copy this entry to different release(s) i.e environment(s). Its useful when you have to update some texts in more than one environment.">
        {environments.map((e) => (
          <Option key={e} value={e}>
            {e}
          </Option>
        ))}
      </SelectField>
      <div style={{ margin: 50 }} />
      <Button
        buttonType="negative"
        isFullWidth={true}
        disabled={isLoading || !targetEnv}
        onClick={onCopyPress}
        loading={isLoading}>
        {targetEnv ? `Copy entry to ${targetEnv} env` : 'Copy entry'}
      </Button>
    </div>
  );
}
