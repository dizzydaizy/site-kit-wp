/**
 * Account Select component tests.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import AccountSelect from './AccountSelect';
import { fireEvent, render } from '../../../../../../tests/js/test-utils';
import { STORE_NAME, ACCOUNT_CREATE } from '../../datastore/constants';
import * as fixtures from '../../datastore/__fixtures__';
import fetchMock from 'fetch-mock';

const setupRegistry = ( registry ) => {
	registry.dispatch( STORE_NAME ).setSettings( {} );
	registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
	registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
};

const setupLoadingRegistry = ( registry ) => {
	fetchMock.getOnce(
		/^\/google-site-kit\/v1\/modules\/tagmanager\/data\/accounts/,
		new Promise( () => {} ) // Return a promise that never resolves to simulate an endless request.
	);
	registry.dispatch( STORE_NAME ).setSettings( {} );
	registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
};

const setupEmptyRegistry = ( registry ) => {
	registry.dispatch( STORE_NAME ).setSettings( {} );
	registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );
	registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
};

describe( 'AccountSelect', () => {
	afterEach( () => fetchMock.mockClear() );

	it( 'should render an option for each analytics account', () => {
		const { getAllByRole } = render( <AccountSelect />, { setupRegistry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		// Note: we do length + 1 here because there should also be an item for
		// "Set up a new account".
		expect( listItems ).toHaveLength( fixtures.accounts.length + 1 );
		expect(
			listItems.some( ( { dataset } ) => dataset.value === ACCOUNT_CREATE )
		).toBe( true );
	} );

	it( 'should have a "Set up a new account" item at the end of the list', async () => {
		const { getAllByRole } = render( <AccountSelect />, { setupRegistry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		expect( listItems[ listItems.length - 1 ].textContent ).toMatch( /set up a new account/i );
	} );

	it( 'should render a loading state when accounts are undefined', async () => {
		const { queryAllByRole, queryByRole } = render( <AccountSelect />, { setupRegistry: setupLoadingRegistry } );

		expect( queryAllByRole( 'menuitem', { hidden: true } ) ).toHaveLength( 0 );

		expect( queryByRole( 'progressbar' ) ).toBeInTheDocument();
	} );

	it( 'should render a select box with only the set up option when no accounts exist', async () => {
		const { getAllByRole } = render( <AccountSelect />, { setupRegistry: setupEmptyRegistry } );

		const listItems = getAllByRole( 'menuitem', { hidden: true } );
		expect( listItems ).toHaveLength( 1 );
		expect( listItems[ listItems.length - 1 ].textContent ).toMatch( /set up a new account/i );
	} );

	it( 'should update accountID in the store when a new item is clicked', async () => {
		const { getByText, container, registry } = render( <AccountSelect />, { setupRegistry } );
		const originalAccountID = registry.select( STORE_NAME ).getAccountID();

		// Click the label to expose the elements in the menu.
		fireEvent.click( container.querySelector( '.mdc-floating-label' ) );
		// Click this element to select it and fire the onChange event.
		fireEvent.click( getByText( /set up a new account/i ) );
		// Note: we use the new account option here to avoid querying properties profiles,
		// as these are pre-selected when this changed (see next test).

		const newAccountID = registry.select( STORE_NAME ).getAccountID();
		expect( originalAccountID ).not.toEqual( newAccountID );
		expect( newAccountID ).toEqual( ACCOUNT_CREATE );
	} );
} );
