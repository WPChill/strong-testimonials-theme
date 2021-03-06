/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Edit from './components/edit';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createBlock } = wp.blocks;
const { RichText, getColorClassName, getFontSizeClass } = wp.editor;

/**
 * Block constants
 */
const name = 'highlight';

const title = __( 'Highlight' );

const icon = 'editor-italic';

const keywords = [
	__( 'text' ),
	__( 'paragraph' ),
	__( 'highlight' ),
];

const blockAttributes = {
	content: {
		type: 'string',
		source: 'html',
		selector: 'mark',
	},
	align: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	fontSize: {
		type: 'string',
	},
	customFontSize: {
		type: 'number',
	},
};

const settings = {

	title: title,

	description: __( 'Highlight text.' ),

	keywords: keywords,

	attributes: blockAttributes,

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( `machothemes/${ name }`, {
						content,
					} );
				},
			},
			{
				type: 'raw',
				selector: 'div.wp-block-machothemes-highlight',
				schema: {
					div: {
						classes: [ 'wp-block-machothemes-highlight' ],
					},
				},
			},
			{
				type: 'prefix',
				prefix: ':highlight',
				transform: function( content ) {
					return createBlock( `machothemes/${ name }`, {
						content,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					// transforming an empty block
					if ( ! content || ! content.length ) {
						return createBlock( 'core/paragraph' );
					}
					// transforming a block with content
					return createBlock( 'core/paragraph', {
						content: content,
					} );
				},
			},
		],
	},

	edit: Edit,

	save( { attributes } ) {

		const {
			backgroundColor,
			content,
			customBackgroundColor,
			customFontSize,
			customTextColor,
			fontSize,
			textAlign,
			textColor,
		} = attributes;

		const textClass = getColorClassName( 'color', textColor );

		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const fontSizeClass = getFontSizeClass( fontSize );

		const classes = classnames( 'wp-block-machothemes-highlight__content', {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass,
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass,
			[ fontSizeClass ]: fontSizeClass,
		} );

		const styles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
			fontSize: fontSizeClass ? undefined : customFontSize,
		};

		return (
			<p style={ { textAlign: textAlign } }>
				{ ! RichText.isEmpty( content ) && (
					<RichText.Content
						tagName="mark"
						className={ classes }
						style={ styles }
						value={ content }
					/>
				) }
			</p>
		);
	},
};

export { name, title, icon, settings };
