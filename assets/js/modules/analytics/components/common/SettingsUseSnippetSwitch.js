/**
 * Analytics Settings Use Snippet Switch component.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { MODULES_ANALYTICS } from '../../datastore/constants';
import UseSnippetSwitch from './UseSnippetSwitch';
const { useSelect } = Data;

export default function SettingsUseSnippetSwitch() {
	const useSnippet = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getUseSnippet()
	);
	const canUseSnippet = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getCanUseSnippet()
	);

	let description;

	if ( canUseSnippet === false ) {
		description = __(
			'The code is controlled by the Tag Manager module.',
			'google-site-kit'
		);
	} else if ( canUseSnippet && useSnippet ) {
		description = __(
			'Site Kit will add the UA code automatically.',
			'google-site-kit'
		);
	} else if ( canUseSnippet && ! useSnippet ) {
		description = __(
			'Site Kit will not add the UA code to your site.',
			'google-site-kit'
		);
	}

	return <UseSnippetSwitch description={ <p>{ description }</p> } />;
}
