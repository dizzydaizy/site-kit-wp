/**
 * Analytics 4 Settings form.
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { Fragment, createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSelect } from 'googlesitekit-data';
import { TrackingExclusionSwitches } from '../common';
import { MODULES_ANALYTICS_4 } from '../../datastore/constants';
import SettingsControls from './SettingsControls';
import AdsConversionIDSettingsNotice from './AdsConversionIDSettingsNotice';
import EntityOwnershipChangeNotice from '../../../../components/settings/EntityOwnershipChangeNotice';
import { isValidAccountID } from '../../utils/validation';
import ConversionTrackingToggle from '../../../../components/conversion-tracking/ConversionTrackingToggle';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import Link from '../../../../components/Link';
import SettingsEnhancedMeasurementSwitch from './SettingsEnhancedMeasurementSwitch';

export default function SettingsForm( { hasModuleAccess } ) {
	const accountID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).getAccountID()
	);

	const conversionTrackingDocumentationURL = useSelect( ( select ) =>
		select( CORE_SITE ).getDocumentationLinkURL(
			'enhanced-conversion-tracking'
		)
	);

	return (
		<Fragment>
			<SettingsControls hasModuleAccess={ hasModuleAccess } />

			{ isValidAccountID( accountID ) && <TrackingExclusionSwitches /> }

			{ hasModuleAccess && (
				<EntityOwnershipChangeNotice slug={ [ 'analytics-4' ] } />
			) }

			<div className="googlesitekit-settings-module__measurement_toggles">
				<h4>{ __( 'Improve your measurement', 'google-site-kit' ) }</h4>
				<SettingsEnhancedMeasurementSwitch
					hasModuleAccess={ hasModuleAccess }
				/>
				<ConversionTrackingToggle>
					{ createInterpolateElement(
						__(
							'Conversion tracking is used for tracking additional conversion-related events via Analytics. <a>Learn more</a>',
							'google-site-kit'
						),
						{
							a: (
								<Link
									href={ conversionTrackingDocumentationURL }
									external
									aria-label={ __(
										'Learn more about conversion tracking',
										'google-site-kit'
									) }
								/>
							),
						}
					) }
				</ConversionTrackingToggle>
			</div>

			{ isValidAccountID( accountID ) && (
				<AdsConversionIDSettingsNotice />
			) }
		</Fragment>
	);
}

SettingsForm.propTypes = {
	hasModuleAccess: PropTypes.bool,
};
