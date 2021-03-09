/**
 * User Input Select Options.
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

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import Radio from '../Radio';
import Checkbox from '../Checkbox';
import { Cell, Input, TextField } from '../../material-components';
const { useSelect, useDispatch } = Data;

export default function UserInputSelectOptions( { slug, options, max } ) {
	const values = useSelect( ( select ) => select( CORE_USER ).getUserInputSetting( slug ) || [] );
	const [ other, setOther ] = useState( values.filter( ( value ) => ! options[ value ] )[ 0 ] || '' );
	const { setUserInputSetting } = useDispatch( CORE_USER );

	// Need to make sure that dependencies list always has the same number of elements.
	const dependencies = values.concat( Array( max ) ).slice( 0, max );

	const onClick = useCallback( ( event ) => {
		const { target } = event;
		const { value, checked } = target;

		const newValues = new Set( [ value, ...values ] );
		if ( ! checked ) {
			newValues.delete( value );
		}

		setUserInputSetting( slug, Array.from( newValues ).slice( 0, max ) );
	}, dependencies );

	const onOtherChange = useCallback( ( { target } ) => {
		const newValues = [
			target.value,
			...values.filter( ( value ) => !! options[ value ] ),
		];

		setOther( target.value );

		// @TODO see the IB in https://github.com/google/site-kit-wp/issues/2828
		// for the right approach to do this.
		const otherCheckBox = document.getElementById( 'goals-other' );
		if ( ! otherCheckBox.checked ) {
			otherCheckBox.click();
		}
		setUserInputSetting( slug, newValues.slice( 0, max ) );
	}, dependencies );

	const onClickProps = {
		[ max > 1 ? 'onChange' : 'onClick' ]: onClick,
	};

	const ListComponent = max === 1 ? Radio : Checkbox;
	const items = Object.keys( options ).map( ( optionSlug ) => {
		const props = {
			id: `${ slug }-${ optionSlug }`,
			value: optionSlug,
			checked: values.includes( optionSlug ),
			...onClickProps,
		};

		if ( max > 1 ) {
			props.disabled = values.length >= max && ! values.includes( optionSlug );
			props.name = `${ slug }-${ optionSlug }`;
		} else {
			props.name = slug;
		}

		return (
			<div key={ optionSlug } className="googlesitekit-user-input__select-option">
				<ListComponent { ...props }>
					{ options[ optionSlug ] }
				</ListComponent>
			</div>
		);
	} );

	return (
		<Cell lgStart={ 6 } lgSize={ 6 } mdSize={ 8 } smSize={ 4 }>
			<div className="googlesitekit-user-input__select-options">
				{ items }

				<div className="googlesitekit-user-input__select-option">
					<ListComponent
						id={ `${ slug }-other` }
						name={ max === 1 ? slug : `${ slug }-other` }
						value={ other }
						checked={ values.includes( other ) }
						disabled={ max > 1 && values.length >= max && ! values.includes( other ) }
						{ ...onClickProps }
					>
						{ __( 'Other:', 'google-site-kit' ) }
					</ListComponent>

					<TextField>
						<Input
							id={ `${ slug }-select-options` }
							value={ other }
							onChange={ onOtherChange }
							disabled={ max > 1 && values.length >= max && ! values.includes( other ) }
						/>
					</TextField>
				</div>
			</div>

			<p className="googlesitekit-user-input__note">
				{ max === 1 && __( 'Choose only one (1) answer', 'google-site-kit' ) }
				{ max === 2 && __( 'Choose only two (2) answers', 'google-site-kit' ) }
				{ max === 3 && __( 'Choose only three (3) answers', 'google-site-kit' ) }
			</p>
		</Cell>
	);
}

UserInputSelectOptions.propTypes = {
	slug: PropTypes.string.isRequired,
	options: PropTypes.shape( {} ).isRequired,
	max: PropTypes.number,
};

UserInputSelectOptions.defaultProps = {
	max: 1,
};
