/**
 * Tag Manager Settings Use Snippet Switch component.
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
import UseSnippetSwitch from './UseSnippetSwitch';
import { MODULES_TAGMANAGER } from '../../datastore/constants';
const { useSelect } = Data;

export default function SettingsUseSnippetSwitch() {
	const useSnippet = useSelect( ( select ) =>
		select( MODULES_TAGMANAGER ).getUseSnippet()
	);

	const description = useSnippet
		? __( 'Site Kit will add the code automatically.', 'google-site-kit' )
		: __(
				'Site Kit will not add the code to your site.',
				'google-site-kit'
		  );

	return <UseSnippetSwitch description={ <p>{ description }</p> } />;
}
