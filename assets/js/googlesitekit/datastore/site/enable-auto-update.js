/**
 * `core/site` data store: enable-autp-update.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
 * External dependencies
 */
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_SITE } from './constants';
import { createFetchStore } from '../../data/create-fetch-store';
import { actions as errorStoreActions } from '../../data/create-error-store';
import { CORE_USER } from '../user/constants';

const { receiveError, clearError } = errorStoreActions;
const { createRegistrySelector } = Data;

const fetchEnableAutoUpdateStore = createFetchStore( {
	baseName: 'enableAutoUpdate',
	controlCallback: async ( { nonce, pluginBasename } ) => {
		const data = new FormData();
		data.append( 'action', 'toggle-auto-updates' );
		data.append( '_ajax_nonce', nonce );
		data.append( 'state', 'enable' );
		data.append( 'type', 'plugin' );
		data.append( 'asset', pluginBasename );

		const response = await fetch( global.ajaxurl, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} );

		return response.json();
	},
	argsToParams: ( { nonce, pluginBasename } ) => {
		return {
			nonce,
			pluginBasename,
		};
	},
	validateParams: ( { nonce, pluginBasename } ) => {
		invariant( typeof nonce === 'string', 'nonce is required.' );
		invariant(
			typeof pluginBasename === 'string',
			'pluginBasename is required.'
		);
	},
} );

const baseInitialState = {};

const baseActions = {
	/**
	 * Enables auto updates for Site Kit.
	 *
	 * WARNING: This causes the website's connection with Google Site Kit to be
	 * removed and will require re-authentication. Use this action with caution,
	 * and always request user confirmation before dispatching.
	 *
	 * @since n.e.x.t
	 */
	*enableAutoUpdate() {
		yield clearError( 'enableAutoUpdate', [] );

		const registry = yield Data.commonActions.getRegistry();

		const nonce = registry.select( CORE_USER ).getNonce( 'updates' );
		const pluginBasename = registry.select( CORE_SITE ).getPluginBasename();

		if ( ! nonce || ! pluginBasename ) {
			return;
		}

		const { response } =
			yield fetchEnableAutoUpdateStore.actions.fetchEnableAutoUpdate( {
				nonce,
				pluginBasename,
			} );

		if ( response.data?.error ) {
			yield receiveError( response.data.error, 'enableAutoUpdate', [] );
		}

		if ( response.success ) {
			yield registry
				.dispatch( CORE_SITE )
				.setSiteKitAutoUpdatesEnabled( true );
		}
	},
};

const baseSelectors = {
	/**
	 * Checks if enableAutoUpdate action is in-process.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state          Data store's state.
	 * @param {string} nonce          The nonce string.
	 * @param {string} pluginBasename The plugin base name.
	 * @return {boolean} `true` if enableAutoUpdate is in-flight; `false` if not.
	 */
	isDoingEnableAutoUpdate: createRegistrySelector(
		( select ) =>
			( state, { nonce, pluginBasename } ) => {
				return select( CORE_SITE ).isFetchingEnableAutoUpdate( {
					nonce,
					pluginBasename,
				} );
			}
	),
};

const store = Data.combineStores( fetchEnableAutoUpdateStore, {
	initialState: baseInitialState,
	actions: baseActions,
	selectors: baseSelectors,
} );

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
