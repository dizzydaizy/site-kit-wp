/**
 * `modules/search-console` data store: settings.
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
import API from 'googlesitekit-api';
import { TYPE_MODULES } from '../../../components/data/constants';
import { invalidateCacheGroup } from '../../../components/data/invalidate-cache-group';
import { createStrictSelect } from '../../../googlesitekit/data/utils';
import { isValidPropertyID } from '../util';
import { STORE_NAME } from './constants';

// Invariant error messages.
export const INVARIANT_INVALID_PROPERTY_SELECTION = 'a valid propertyID is required to submit changes';

export async function submitChanges( { select, dispatch } ) {
	// This action shouldn't be called if settings haven't changed,
	// but this prevents errors in tests.
	if ( select( STORE_NAME ).haveSettingsChanged() ) {
		const { error } = await dispatch( STORE_NAME ).saveSettings();
		if ( error ) {
			return { error };
		}
	}

	await API.invalidateCache( 'modules', 'search-console' );
	// TODO: Remove once legacy dataAPI is no longer used.
	invalidateCacheGroup( TYPE_MODULES, 'search-console' );

	return {};
}

export function validateCanSubmitChanges( select ) {
	const strictSelect = createStrictSelect( select );
	const { getPropertyID } = strictSelect( STORE_NAME );
	invariant( isValidPropertyID( getPropertyID() ), INVARIANT_INVALID_PROPERTY_SELECTION );
}
