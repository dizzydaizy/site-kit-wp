/**
 * Badge component.
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
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

const Badge = forwardRef(
	( { label, className, hasLeftSpacing = false }, ref ) => (
		<span
			ref={ ref }
			className={ classnames( 'googlesitekit-badge', className, {
				'googlesitekit-badge--has-left-spacing': hasLeftSpacing,
			} ) }
		>
			{ label }
		</span>
	)
);

Badge.displayName = 'Badge';

Badge.propTypes = {
	label: PropTypes.string.isRequired,
	hasLeftSpacing: PropTypes.bool,
};

export default Badge;
