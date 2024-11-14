/**
 * `modules/reader-revenue-manager` data store: publications.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
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
import { isPlainObject } from 'lodash';

/**
 * Internal dependencies.
 */
import API from 'googlesitekit-api';
import { CORE_UI } from '../../../googlesitekit/datastore/ui/constants';
import { commonActions, combineStores } from 'googlesitekit-data';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
import { createValidatedAction } from '../../../googlesitekit/data/utils';
import {
	MODULES_READER_REVENUE_MANAGER,
	READER_REVENUE_MANAGER_MODULE_SLUG,
	PUBLICATION_ONBOARDING_STATES,
	UI_KEY_READER_REVENUE_MANAGER_SHOW_PUBLICATION_APPROVED_NOTIFICATION,
} from './constants';
import { actions as errorStoreActions } from '../../../googlesitekit/data/create-error-store';

const fetchGetPublicationsStore = createFetchStore( {
	baseName: 'getPublications',
	controlCallback: () =>
		API.get(
			'modules',
			READER_REVENUE_MANAGER_MODULE_SLUG,
			'publications',
			{},
			{ useCache: false }
		),
	reducerCallback: ( state, publications ) => ( { ...state, publications } ),
} );

const baseInitialState = {
	publications: undefined,
};

const baseActions = {
	/**
	 * Synchronizes the onboarding state of the publication with the API.
	 * Updates the settings on the server.
	 *
	 * @since 1.132.0
	 *
	 * @return {void}
	 */
	*syncPublicationOnboardingState() {
		const registry = yield commonActions.getRegistry();

		const settings = yield commonActions.await(
			registry
				.resolveSelect( MODULES_READER_REVENUE_MANAGER )
				.getSettings()
		);

		const publicationID = registry
			.select( MODULES_READER_REVENUE_MANAGER )
			.getPublicationID();

		// If there is no publication ID in state, do not attempt to sync
		// the onboarding state.
		if ( publicationID === undefined ) {
			return;
		}

		yield baseActions.resetPublications();

		const publications = yield commonActions.await(
			registry
				.resolveSelect( MODULES_READER_REVENUE_MANAGER )
				.getPublications()
		) || [];

		const publication = publications.find(
			// eslint-disable-next-line sitekit/acronym-case
			( { publicationId } ) => publicationId === publicationID
		);

		// If the publication is not found, do not attempt to sync the onboarding state.
		if ( ! publication ) {
			return;
		}

		const { onboardingState: newOnboardingState } = publication;

		registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.setPublicationOnboardingState( newOnboardingState );

		const hasPublicationIDChanged = registry
			.select( MODULES_READER_REVENUE_MANAGER )
			.hasSettingChanged( 'publicationID' );

		// Only save the synced onboarding state if there is a saved publication ID.
		if ( hasPublicationIDChanged ) {
			return;
		}

		yield commonActions.await(
			registry.dispatch( MODULES_READER_REVENUE_MANAGER ).saveSettings()
		);

		const { publicationOnboardingState: currentOnboardingState } = settings;

		// If the onboarding state changes to complete from a non-empty state, set
		// the key in CORE_UI to trigger the notification.
		if (
			!! currentOnboardingState &&
			newOnboardingState !== currentOnboardingState &&
			newOnboardingState ===
				PUBLICATION_ONBOARDING_STATES.ONBOARDING_COMPLETE
		) {
			registry
				.dispatch( CORE_UI )
				.setValue(
					UI_KEY_READER_REVENUE_MANAGER_SHOW_PUBLICATION_APPROVED_NOTIFICATION,
					true
				);
		}
	},

	/**
	 * Finds a matched publication.
	 *
	 * @since 1.132.0
	 *
	 * @return {Object|null} Matched publication; `null` if none found.
	 */
	*findMatchedPublication() {
		const { resolveSelect } = yield commonActions.getRegistry();
		const publications = yield commonActions.await(
			resolveSelect( MODULES_READER_REVENUE_MANAGER ).getPublications()
		);

		if ( publications.length === 0 ) {
			return null;
		}

		if ( publications.length === 1 ) {
			return publications[ 0 ];
		}

		const completedOnboardingPublication = publications.find(
			( publication ) =>
				publication.onboardingState ===
				PUBLICATION_ONBOARDING_STATES.ONBOARDING_COMPLETE
		);

		return completedOnboardingPublication || publications[ 0 ];
	},

	/**
	 * Resets the publications data in the store.
	 *
	 * @since 1.133.0
	 *
	 * @return {Object} The dispatched action results.
	 */
	*resetPublications() {
		const registry = yield commonActions.getRegistry();

		yield {
			type: 'RESET_PUBLICATIONS',
		};

		yield errorStoreActions.clearErrors( 'getPublications' );

		return registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.invalidateResolutionForStoreSelector( 'getPublications' );
	},

	/**
	 * Sets the given publication in the store.
	 *
	 * @since 1.133.0
	 *
	 * @param {Object} publication The publiation object.
	 * @return {Object} A Generator function.
	 */
	selectPublication: createValidatedAction(
		( publication ) => {
			invariant(
				isPlainObject( publication ),
				'A valid publication object is required.'
			);

			[ 'publicationId', 'onboardingState' ].forEach( ( key ) => {
				invariant(
					publication.hasOwnProperty( key ),
					`The publication object must contain ${ key }`
				);
			} );
		},
		// `publicationId` is the identifier used by the API.
		// eslint-disable-next-line sitekit/acronym-case
		function* ( { publicationId: publicationID, onboardingState } ) {
			const registry = yield commonActions.getRegistry();

			return registry
				.dispatch( MODULES_READER_REVENUE_MANAGER )
				.setSettings( {
					publicationID,
					publicationOnboardingState: onboardingState,
				} );
		}
	),
};

const baseControls = {};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		case 'RESET_PUBLICATIONS':
			return {
				...state,
				publications: baseInitialState.publications,
			};
		default:
			return state;
	}
};

const baseResolvers = {
	*getPublications() {
		const registry = yield commonActions.getRegistry();
		// Only fetch publications if there are none in the store.
		const publications = registry
			.select( MODULES_READER_REVENUE_MANAGER )
			.getPublications();
		if ( publications === undefined ) {
			yield fetchGetPublicationsStore.actions.fetchGetPublications();
		}
	},
};

const baseSelectors = {
	/**
	 * Gets list of publications associated with the account.
	 *
	 * @since 1.132.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array.<Object>|undefined)} An array of publications; `undefined` if not loaded.
	 */
	getPublications( state ) {
		return state.publications;
	},
};

const store = combineStores( fetchGetPublicationsStore, {
	initialState: baseInitialState,
	actions: baseActions,
	controls: baseControls,
	reducer: baseReducer,
	resolvers: baseResolvers,
	selectors: baseSelectors,
} );

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
