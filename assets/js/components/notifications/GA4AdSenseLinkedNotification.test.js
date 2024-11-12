/**
 * GA4AdSenseLinkedNotification component tests.
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
 * Internal dependencies
 */
import {
	render,
	createTestRegistry,
	provideModules,
	provideNotifications,
	act,
	waitForDefaultTimeouts,
} from '../../../../tests/js/test-utils';
import { provideAnalytics4MockReport } from '../../modules/analytics-4/utils/data-mock';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { MODULES_ANALYTICS_4 } from '../../modules/analytics-4/datastore/constants';
import {
	VIEW_CONTEXT_MAIN_DASHBOARD,
	VIEW_CONTEXT_SETTINGS,
} from '../../googlesitekit/constants';
import { DEFAULT_NOTIFICATIONS } from '../../googlesitekit/notifications/register-defaults';
import { NOTIFICATION_AREAS } from '../../googlesitekit/notifications/datastore/constants';
import Notifications from './Notifications';

const GA4_ADSENSE_LINKED_NOTIFICATION =
	'top-earning-pages-success-notification';

describe( 'GA4AdSenseLinkedNotification', () => {
	let registry;

	const analyticsReport = new RegExp(
		'^/google-site-kit/v1/modules/analytics-4/data/report'
	);

	beforeEach( () => {
		registry = createTestRegistry();
		// All the below conditions will trigger a successful notification.
		// So each individual failing test case further below will overwrite one
		// of the success criteria.
		act( () => {
			provideModules( registry, [
				{
					active: true,
					connected: true,
					slug: 'analytics-4',
				},
				{
					active: true,
					connected: true,
					slug: 'adsense',
				},
			] );
			provideNotifications(
				registry,
				{
					[ GA4_ADSENSE_LINKED_NOTIFICATION ]:
						DEFAULT_NOTIFICATIONS[
							GA4_ADSENSE_LINKED_NOTIFICATION
						],
				},
				true
			);
			registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {
				adSenseLinked: true,
			} );
			registry.dispatch( CORE_USER ).receiveGetDismissedItems( [] );
			fetchMock.getOnce( analyticsReport, {
				body: {
					rowCount: null,
				},
				status: 200,
			} );
		} );
	} );

	it( 'does not render if AdSense module is not active', async () => {
		act( () => {
			provideModules( registry, [
				{
					active: false,
					connected: false,
					slug: 'adsense',
				},
			] );
		} );

		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( container.childElementCount ).toBe( 0 );
	} );

	it( 'does not render if AdSense and Analytics are not linked', async () => {
		act( () => {
			registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {
				adSenseLinked: false,
			} );
		} );

		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( container.childElementCount ).toBe( 0 );
	} );

	it( 'does not render if report has data, and it is not already dismissed', async () => {
		const reportOptions = {
			startDate: '2020-08-11',
			endDate: '2020-09-07',
			dimensions: [ 'pagePath' ],
			metrics: [ { name: 'totalAdRevenue' } ],
			orderby: [
				{
					metric: { metricName: 'totalAdRevenue' },
					desc: true,
				},
			],
			limit: 3,
		};
		registry.dispatch( CORE_USER ).setReferenceDate( '2020-09-08' );
		provideAnalytics4MockReport( registry, reportOptions );

		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( fetchMock ).not.toHaveFetched(
			'/google-site-kit/v1/modules/analytics-4/data'
		);
		expect( container.childElementCount ).toBe( 0 );
	} );

	it( 'does not render if already dismissed', async () => {
		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedItems( [ GA4_ADSENSE_LINKED_NOTIFICATION ] );

		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( fetchMock ).not.toHaveFetched(
			'/google-site-kit/v1/modules/analytics-4/data'
		);

		expect( container.childElementCount ).toBe( 0 );
	} );

	it( 'does not render when not on the main or entity dashboard', async () => {
		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_SETTINGS,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( fetchMock ).not.toHaveFetched(
			'/google-site-kit/v1/modules/analytics-4/data'
		);

		expect( container.childElementCount ).toBe( 0 );
	} );

	it( 'renders when both Analytics & AdSense modules are active & linked, when report has no data and when it was not previously dismissed', async () => {
		const { container, waitForRegistry } = render(
			<Notifications areaSlug={ NOTIFICATION_AREAS.BANNERS_BELOW_NAV } />,
			{
				registry,
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD,
			}
		);

		await act( waitForRegistry );
		await act( waitForDefaultTimeouts );

		expect( container ).toHaveTextContent(
			'Your AdSense and Analytics accounts are linked'
		);
		expect( container ).toMatchSnapshot();
	} );
} );
