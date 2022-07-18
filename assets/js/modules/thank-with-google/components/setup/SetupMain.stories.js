/**
 * SetupMain component stories.
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
 * Internal dependencies
 */
import { MODULES_THANK_WITH_GOOGLE } from '../../datastore/constants';
import {
	createTestRegistry,
	freezeFetch,
	provideModules,
	provideModuleRegistrations,
	provideSiteInfo,
	WithTestRegistry,
} from '../../../../../../tests/js/utils';
import { Cell, Grid, Row } from '../../../../material-components';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import SetupMain from './SetupMain';

const features = [ 'twgModule' ];

// const publicationWithActiveStateA = {
// 	// eslint-disable-next-line sitekit/acronym-case
// 	publicationId: 'test-publication-a',
// 	displayName: 'Test publication title',
// 	verifiedDomains: [ 'https://example.com' ],
// 	paymentOptions: {
// 		virtualGifts: true,
// 	},
// 	state: 'ACTIVE',
// };
// const publicationWithActiveStateB = {
// 	...publicationWithActiveStateA,
// 	// eslint-disable-next-line sitekit/acronym-case
// 	publicationId: 'test-publication-b',
// };
// const publicationActionRequiredStateC = {
// 	...publicationWithActiveStateA,
// 	// eslint-disable-next-line sitekit/acronym-case
// 	publicationId: 'test-publication-c',
// 	state: 'ACTION_REQUIRED',
// };
// const publicationPendingVerificationD = {
// 	...publicationWithActiveStateA,
// 	// eslint-disable-next-line sitekit/acronym-case
// 	publicationId: 'test-publication-d',
// 	state: 'PENDING_VERIFICATION',
// };
// const publicationsWithActiveState = [
// 	publicationWithActiveStateA,
// 	publicationWithActiveStateB,
// ];

function Template( { setupRegistry } ) {
	return (
		<WithRegistrySetup func={ setupRegistry }>
			<div className="googlesitekit-setup">
				<section className="googlesitekit-setup__wrapper">
					<Grid>
						<Row>
							<Cell size={ 12 }>
								<SetupMain />
							</Cell>
						</Row>
					</Grid>
				</section>
			</div>
		</WithRegistrySetup>
	);
}

export const PublicationsLoading = Template.bind( {} );
PublicationsLoading.storyName = 'Publications Loading';
PublicationsLoading.args = {
	setupRegistry: () => {
		freezeFetch(
			/^\/google-site-kit\/v1\/modules\/thank-with-google\/data\/publications/
		);
	},
};

export const CreatePublication = Template.bind( {} );
CreatePublication.storyName = 'Create Publication';
CreatePublication.args = {
	setupRegistry: ( registry ) => {
		registry
			.dispatch( MODULES_THANK_WITH_GOOGLE )
			.receiveGetPublications( [] );
	},
};

export default {
	title: 'Modules/Thank with Google/Setup/SetupMain',
	component: SetupMain,
	decorators: [
		( Story ) => {
			const registry = createTestRegistry();
			provideModules( registry, [
				{
					slug: 'thank-with-google',
					active: true,
					connected: false,
				},
			] );
			provideSiteInfo( registry );
			provideModuleRegistrations( registry );

			return (
				<WithTestRegistry
					registry={ registry }
					features={ [ 'twgModule' ] }
				>
					<Story />
				</WithTestRegistry>
			);
		},
	],
	parameters: { padding: 0, features },
};
