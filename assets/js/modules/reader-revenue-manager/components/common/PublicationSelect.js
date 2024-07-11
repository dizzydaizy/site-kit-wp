/* eslint-disable sitekit/acronym-case */
/**
 * Publication Select component.
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
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Option, Select } from 'googlesitekit-components';
import { useSelect, useDispatch } from 'googlesitekit-data';
import { MODULES_READER_REVENUE_MANAGER } from '../../datastore/constants';
import { isValidPublicationID } from '../../utils/validation';

export default function PublicationSelect( props ) {
	const {
		isDisabled,
		hasModuleAccess,
		className,
		onChange = () => {},
	} = props;

	const { setPublicationID, setPublicationOnboardingState } = useDispatch(
		MODULES_READER_REVENUE_MANAGER
	);

	const publicationID = useSelect( ( select ) =>
		select( MODULES_READER_REVENUE_MANAGER ).getPublicationID()
	);

	const publications = useSelect( ( select ) =>
		hasModuleAccess !== false && ! isDisabled
			? select( MODULES_READER_REVENUE_MANAGER ).getPublications() || []
			: null
	);

	const onPublicationChange = useCallback(
		( index, item ) => {
			const newPublicationID = item.dataset.value;

			const publication = publications.find(
				( { publicationId } ) => publicationId === newPublicationID
			);

			const { publicationId, onboardingState } = publication;

			// eslint-disable-next-line sitekit/acronym-case
			setPublicationID( publicationId );
			setPublicationOnboardingState( onboardingState );

			onChange();
		},
		[
			onChange,
			setPublicationID,
			setPublicationOnboardingState,
			publications,
		]
	);

	if ( ! isValidPublicationID( publicationID ) ) {
		return null;
	}

	const isValidSelection =
		publicationID === undefined || publicationID === ''
			? true
			: isValidPublicationID( publicationID );

	if ( hasModuleAccess === false ) {
		return (
			<Select
				className={ classnames(
					'googlesitekit-analytics-4__select-publication',
					className
				) }
				label={ __( 'Publication', 'google-site-kit' ) }
				value={ publicationID }
				enhanced
				outlined
				disabled
			>
				<Option value={ publicationID }>{ publicationID }</Option>
			</Select>
		);
	}

	return (
		<Select
			className={ classnames(
				'googlesitekit-analytics-4__select-publication',
				className,
				{
					'mdc-select--invalid': ! isValidSelection,
				}
			) }
			label={ __( 'Publication', 'google-site-kit' ) }
			value={ publicationID }
			onEnhancedChange={ onPublicationChange }
			disabled={ isDisabled }
			enhanced
			outlined
		>
			{ ( publications || [] ).map(
				( { publicationId, displayName } ) => (
					<Option
						// eslint-disable-next-line sitekit/acronym-case
						key={ publicationId }
						value={ publicationId }
					>
						{ displayName }
					</Option>
				)
			) }
		</Select>
	);
}

PublicationSelect.propTypes = {
	isDisabled: PropTypes.bool,
	hasModuleAccess: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
};
