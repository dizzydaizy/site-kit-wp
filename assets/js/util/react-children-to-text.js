/**
 * Utilities for extracting text from React children.
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
 * WordPress dependencies
 */
import { Children, ReactNode } from '@wordpress/element';

/**
 * Gets text from React children including all descendants. Returns a flat array of strings.
 *
 * @since n.e.x.t
 *
 * @param {ReactNode} children Children to extract text from.
 * @return {Array.<string>} Array of text strings.
 */
function getTextFromChildren( children ) {
	const text = [];

	Children.map( children, ( child ) => {
		if ( ! child ) {
			return;
		}

		const childType = typeof child;

		if ( 'string' === childType || 'number' === childType ) {
			text.push( child.toString() );
		} else {
			text.push( ...getTextFromChildren( child.props.children ) );
		}
	} );

	return text;
}

/**
 * Gets text from React children including all descendants. Returns a single string.
 *
 * @since n.e.x.t
 *
 * @param {ReactNode} children Children to extract text from.
 * @return {string} Single string of text.
 */
export function getLabelFromChildren( children ) {
	const labels = getTextFromChildren( children );

	return labels
		.map( ( label ) => label.trim() )
		.filter( ( label ) => label.length )
		.join( ' ' );
}
