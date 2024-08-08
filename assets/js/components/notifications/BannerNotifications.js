/**
 * BannerNotifications component.
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
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useSelect } from 'googlesitekit-data';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import {
	GTM_SCOPE,
	MODULES_ANALYTICS_4,
} from '../../modules/analytics-4/datastore/constants';
import useQueryArg from '../../hooks/useQueryArg';
import SetupSuccessBannerNotification from './SetupSuccessBannerNotification';
import CoreSiteBannerNotifications from './CoreSiteBannerNotifications';
import ModuleRecoveryAlert from '../dashboard-sharing/ModuleRecoveryAlert';
import AdSenseAlerts from './AdSenseAlerts';
import EnhancedMeasurementActivationBanner from '../../modules/analytics-4/components/dashboard/EnhancedMeasurementActivationBanner';
import useViewOnly from '../../hooks/useViewOnly';
import useViewContext from '../../hooks/useViewContext';
import ZeroDataNotification from './ZeroDataNotification';
import EnableAutoUpdateBannerNotification from './EnableAutoUpdateBannerNotification';
import GoogleTagIDMismatchNotification from './GoogleTagIDMismatchNotification';
import WebDataStreamNotAvailableNotification from './WebDataStreamNotAvailableNotification';
import AdBlockingRecoverySetupSuccessBannerNotification from './AdBlockingRecoverySetupSuccessBannerNotification';
import { CORE_UI } from '../../googlesitekit/datastore/ui/constants';
import { UI_KEY_KEY_METRICS_SETUP_CTA_RENDERED } from '../KeyMetrics/KeyMetricsSetupCTARenderedEffect';
import { NOTIFICATION_AREAS } from '../../googlesitekit/notifications/datastore/constants';
import Notifications from './Notifications';

export default function BannerNotifications() {
	const viewOnly = useViewOnly();
	const viewContext = useViewContext();

	const isAuthenticated = useSelect( ( select ) =>
		select( CORE_USER ).isAuthenticated()
	);
	const adSenseModuleActive = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleActive( 'adsense' )
	);
	const ga4ModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'analytics-4' )
	);
	const hasGTMScope = useSelect( ( select ) =>
		select( CORE_USER ).hasScope( GTM_SCOPE )
	);

	const hasMismatchedGoogleTagID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).hasMismatchedGoogleTagID()
	);
	const keyMetricsSetupCTARendered = useSelect( ( select ) =>
		select( CORE_UI ).getValue( UI_KEY_KEY_METRICS_SETUP_CTA_RENDERED )
	);

	const isGA4ModuleOwner = useSelect( ( select ) => {
		// Bail early if we're in view-only dashboard or the GA4 module is not connected.
		if ( viewOnly || ! ga4ModuleConnected ) {
			return false;
		}

		const ga4OwnerID = select( MODULES_ANALYTICS_4 ).getOwnerID();

		const loggedInUserID = select( CORE_USER ).getID();

		if ( ga4OwnerID === undefined || loggedInUserID === undefined ) {
			return undefined;
		}

		return ga4OwnerID === loggedInUserID;
	} );

	const [ notification ] = useQueryArg( 'notification' );
	const [ slug ] = useQueryArg( 'slug' );

	if ( viewOnly ) {
		return (
			<Fragment>
				<ZeroDataNotification />
				<Notifications
					viewContext={ viewContext }
					areaSlug={ NOTIFICATION_AREAS.BANNERS_ABOVE_NAV }
				/>
			</Fragment>
		);
	}

	return (
		<Fragment>
			{ adSenseModuleActive && <AdSenseAlerts /> }
			<ModuleRecoveryAlert />
			{ /* The Ads module uses the new, subtle notification rather than the old SetupSuccessBannerNotification */ }
			{ 'authentication_success' === notification && slug !== 'ads' && (
				<SetupSuccessBannerNotification />
			) }
			{ 'ad_blocking_recovery_setup_success' === notification && (
				<AdBlockingRecoverySetupSuccessBannerNotification />
			) }
			<EnableAutoUpdateBannerNotification />
			{ isAuthenticated && <CoreSiteBannerNotifications /> }
			{ ! keyMetricsSetupCTARendered && (
				<EnhancedMeasurementActivationBanner />
			) }
			{ ga4ModuleConnected && hasGTMScope && isGA4ModuleOwner && (
				<Fragment>
					{ hasMismatchedGoogleTagID && (
						<GoogleTagIDMismatchNotification />
					) }
					<WebDataStreamNotAvailableNotification />
				</Fragment>
			) }
			<Notifications
				viewContext={ viewContext }
				areaSlug={ NOTIFICATION_AREAS.BANNERS_ABOVE_NAV }
			/>
			{ /* Temporary hack to give priority to the `GatheringDataNotification` component queued by `Notifications`.
			This happens because `hasZeroData` selectors return true within `ZeroDataNotification` even if a module is
			still gathering data. `ZeroDataNotification` should be refactored next which will make `Notifications`
			the last component to be rendered. */ }
			<ZeroDataNotification />
		</Fragment>
	);
}
