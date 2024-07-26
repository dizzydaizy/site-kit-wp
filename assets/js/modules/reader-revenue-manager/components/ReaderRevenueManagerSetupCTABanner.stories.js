/**
 * ReaderRevenueManagerSetupCTABanner Component Stories.
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
import fetchMock from 'fetch-mock';

/**
 * Internal dependencies
 */
import { provideModules } from '../../../../../tests/js/utils';
import WithRegistrySetup from '../../../../../tests/js/WithRegistrySetup';
import ReaderRevenueManagerSetupCTABanner from './ReaderRevenueManagerSetupCTABanner';
import { READER_REVENUE_MANAGER_MODULE_SLUG } from '../datastore/constants';
import { CORE_USER } from '../../../googlesitekit/datastore/user/constants';

function Template() {
	return <ReaderRevenueManagerSetupCTABanner />;
}

export const Default = Template.bind( {} );
Default.storyName = 'Default';
Default.args = {
	setupRegistry: ( registry ) => {
		registry.dispatch( CORE_USER ).receiveGetDismissedPrompts( [] );
	},
};
Default.scenario = {
	label: 'Modules/ReaderRevenueManager/Components/Dashboard/ReaderRevenueManagerSetupCTABanner/Default',
	delay: 250,
};

export default {
	title: 'Modules/ReaderRevenueManager/Components/Dashboard/ReaderRevenueManagerSetupCTABanner',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: READER_REVENUE_MANAGER_MODULE_SLUG,
						active: false,
					},
				] );

				args?.setupRegistry( registry );

				fetchMock.postOnce(
					new RegExp(
						'^/google-site-kit/v1/core/user/data/dismiss-items'
					),
					{
						body: [],
						status: 200,
					}
				);
			};

			return (
				<div
					style={ {
						minHeight: '200px',
						display: 'flex',
						alignItems: 'center',
					} }
				>
					<WithRegistrySetup func={ setupRegistry }>
						<Story />
					</WithRegistrySetup>
				</div>
			);
		},
	],
};
