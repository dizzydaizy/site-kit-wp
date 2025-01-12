/**
 * AdSense Web Stories Ad Unit Select component.
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
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { Select, Option } from '../../../../material-components';
import ProgressBar from '../../../../components/ProgressBar';
import { STORE_NAME } from '../../datastore/constants';
const { useSelect, useDispatch } = Data;

export default function WebStoriesAdUnitSelect() {
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const clientID = useSelect( ( select ) => select( STORE_NAME ).getClientID() );
	const webStoriesAdUnit = useSelect( ( select ) => select( STORE_NAME ).getWebStoriesAdUnit() );

	const { adunits, hasResolvedAdUnits } = useSelect( ( select ) => ( {
		adunits: select( STORE_NAME ).getAdUnits( accountID, clientID ),
		hasResolvedAdUnits: select( STORE_NAME ).hasFinishedResolution( 'getAdUnits', [ accountID, clientID ] ),
	} ) );

	const { setWebStoriesAdUnit } = useDispatch( STORE_NAME );
	const onChange = useCallback( ( index, item ) => {
		const newWebStoriesAdUnit = item.dataset.value;
		if ( webStoriesAdUnit !== newWebStoriesAdUnit ) {
			setWebStoriesAdUnit( newWebStoriesAdUnit );
		}
	}, [ webStoriesAdUnit, setWebStoriesAdUnit ] );

	if ( ! hasResolvedAdUnits ) {
		return <ProgressBar small />;
	}

	return (
		<Select
			className="googlesitekit-adsense__select-field"
			label={ __( 'Web Stories Ad Unit', 'google-site-kit' ) }
			value={ webStoriesAdUnit }
			onEnhancedChange={ onChange }
			enhanced
			outlined
		>
			<Option
				value=""
			>
				{ __( 'Select ad unit', 'google-site-kit' ) }
			</Option>
			{ ( adunits || [] ).map( ( { id, name } ) => (
				<Option
					key={ id }
					value={ id }
				>
					{ name }
				</Option>
			) ) }
		</Select>
	);
}
