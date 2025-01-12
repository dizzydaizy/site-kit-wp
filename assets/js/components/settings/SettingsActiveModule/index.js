/**
 * SettingsActiveModule component.
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
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_MODULES } from '../../../googlesitekit/modules/datastore/constants';
import { Cell, Grid, Row } from '../../../material-components';
import SettingsOverlay from '../SettingsOverlay';
import SettingsRenderer from '../SettingsRenderer';
import Header from './Header';
import Footer from './Footer';
import ConfirmDisconnect from './ConfirmDisconnect';
const { useSelect } = Data;

export default function SettingsActiveModule( props ) {
	const {
		slug,
		onEdit,
		onConfirm,
		onCancel,
		onToggle,
		isEditing,
		isOpen,
		isSaving,
		isLocked,
		error,
	} = props;

	const [ dialogActive, setDialogActive ] = useState( false );
	const deactivationError = useSelect( ( select ) => select( CORE_MODULES ).getErrorForAction( 'deactivateModule', [ slug ] ) );

	const handleDialog = useCallback( () => {
		setDialogActive( ! dialogActive );
	}, [ dialogActive ] );

	return (
		<div
			className={ classnames(
				'googlesitekit-settings-module',
				'googlesitekit-settings-module--active',
				`googlesitekit-settings-module--${ slug }`,
				{ 'googlesitekit-settings-module--error': ( error || deactivationError ) && isEditing }
			) }
		>
			{ isLocked && (
				<SettingsOverlay compress={ ! isOpen } />
			) }

			<Header
				slug={ slug }
				isOpen={ isOpen }
				onToggle={ onToggle }
			/>

			{ isOpen && (
				<div
					id={ `googlesitekit-settings-module__content--${ slug }` }
					className="googlesitekit-settings-module__content googlesitekit-settings-module__content--open"
					role="tabpanel"
					aria-labelledby={ `googlesitekit-settings-module__header--${ slug }` }
				>
					<Grid>
						<Row>
							<Cell size={ 12 }>
								<SettingsRenderer
									slug={ slug }
									isEditing={ isEditing }
									isOpen
								/>
							</Cell>
						</Row>
					</Grid>

					<Footer
						slug={ slug }
						isSaving={ isSaving }
						isEditing={ isEditing }
						onEdit={ onEdit }
						onConfirm={ onConfirm }
						onCancel={ onCancel }
						handleDialog={ handleDialog }
					/>
				</div>
			) }

			{ dialogActive && (
				<ConfirmDisconnect
					slug={ slug }
					handleDialog={ handleDialog }
				/>
			) }
		</div>
	);
}

SettingsActiveModule.propTypes = {
	slug: PropTypes.string.isRequired,
	onEdit: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onToggle: PropTypes.func.isRequired,
	isEditing: PropTypes.bool.isRequired,
	isOpen: PropTypes.bool.isRequired,
	isSaving: PropTypes.bool.isRequired,
	isLocked: PropTypes.bool.isRequired,
	error: PropTypes.shape( {} ),
};
