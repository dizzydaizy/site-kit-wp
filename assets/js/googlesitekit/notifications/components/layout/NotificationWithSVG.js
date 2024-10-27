/**
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
	BREAKPOINT_SMALL,
	BREAKPOINT_TABLET,
	useBreakpoint,
} from '../../../../hooks/useBreakpoint';
import { Cell, Grid, Row } from '../../../../material-components';

export default function NotificationWithSVG( {
	title,
	description,
	actions,
	DesktopSVG,
	TabletSVG,
	MobileSVG,
} ) {
	const breakpoint = useBreakpoint();
	const isMobileBreakpoint = breakpoint === BREAKPOINT_SMALL;
	const isTabletBreakpoint = breakpoint === BREAKPOINT_TABLET;

	return (
		<div className="googlesitekit-widget-context">
			<Grid className="googlesitekit-widget-area">
				<Row>
					<Cell size={ 12 }>
						<div className="googlesitekit-widget googlesitekit-widget--no-padding googlesitekit-setup-cta-banner">
							<div className="googlesitekit-widget__body">
								<Grid collapsed>
									<Row>
										<Cell
											smSize={ 12 }
											mdSize={ 8 }
											lgSize={ 6 }
											className="googlesitekit-setup-cta-banner__primary-cell"
										>
											<h3 className="googlesitekit-setup-cta-banner__title">
												{ title }
											</h3>

											{ description }

											{ actions }
										</Cell>
										{ ! isMobileBreakpoint &&
											! isTabletBreakpoint && (
												<Cell
													alignBottom
													className="googlesitekit-setup-cta-banner__svg-wrapper"
													mdSize={ 8 }
													lgSize={ 6 }
												>
													<DesktopSVG />
												</Cell>
											) }
										{ isTabletBreakpoint && (
											<Cell
												className="googlesitekit-setup-cta-banner__svg-wrapper"
												mdSize={ 8 }
											>
												<TabletSVG />
											</Cell>
										) }
										{ isMobileBreakpoint && (
											<Cell
												alignBottom
												className="googlesitekit-setup-cta-banner__svg-wrapper"
												smSize={ 12 }
											>
												<MobileSVG />
											</Cell>
										) }
									</Row>
								</Grid>
							</div>
						</div>
					</Cell>
				</Row>
			</Grid>
		</div>
	);
}
