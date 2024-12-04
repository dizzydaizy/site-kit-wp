/**
 * Ads SettingsForm component stories.
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
import SettingsForm from './SettingsForm';
import { Cell, Grid, Row } from '../../../../material-components';
import { MODULES_ADS } from '../../datastore/constants';
import {
	provideModules,
	WithTestRegistry,
} from '../../../../../../tests/js/utils';

function Template( args ) {
	return (
		<div className="googlesitekit-layout">
			<div className="googlesitekit-settings-module googlesitekit-settings-module--active googlesitekit-settings-module--ads">
				<div className="googlesitekit-setup-module">
					<div className="googlesitekit-settings-module__content googlesitekit-settings-module__content--open">
						<Grid>
							<Row>
								<Cell size={ 12 }>
									<SettingsForm { ...args } />
								</Cell>
							</Row>
						</Grid>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Default = Template.bind( null );
Default.storyName = 'Default';
Default.scenario = {};
Default.args = {
	setupRegistry: ( registry ) => {
		registry.dispatch( MODULES_ADS ).receiveGetSettings( {
			conversionID: 'AW-123456789',
		} );
	},
};

export const Empty = Template.bind( null );
Empty.storyName = 'Empty';
Empty.scenario = {};

export const FirstPartyModeEnabled = Template.bind( null );
FirstPartyModeEnabled.storyName = 'FirstPartyModeEnabled';
FirstPartyModeEnabled.scenario = {};
FirstPartyModeEnabled.args = {
	features: [ 'firstPartyMode' ],
};

export default {
	title: 'Modules/Ads/Settings/SettingsForm',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: 'ads',
						active: true,
						connected: true,
					},
				] );
				args.setupRegistry?.( registry );
			};

			return (
				<WithTestRegistry
					callback={ setupRegistry }
					features={ args?.features || [] }
				>
					<Story />
				</WithTestRegistry>
			);
		},
	],
};
