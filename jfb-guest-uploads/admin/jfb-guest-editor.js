console.log("🚀 JFB Guest Editor script is now running!");

(function (wp) {
	const { addFilter } = wp.hooks;
	const { createElement, Fragment } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const { PanelBody, ToggleControl } = wp.components;
	const { createHigherOrderComponent } = wp.compose;

	addFilter(
		'blocks.registerBlockType',
		'jfb-guest-uploads/add-attribute',
		(settings, name) => {
			if (name !== 'jet-forms/media-field') return settings;

			return {
				...settings,
				attributes: {
					...settings.attributes,
					allow_guest_upload: {
						type: 'boolean',
						default: false,
					},
				},
			};
		}
	);

	const withGuestUploadControl = createHigherOrderComponent((BlockEdit) => {
		return function (props) {
			if (props.name !== 'jet-forms/media-field') {
				return createElement(BlockEdit, props);
			}

			const { attributes, setAttributes } = props;

			return createElement(
				Fragment,
				null,
				createElement(BlockEdit, props),
				createElement(
					InspectorControls,
					null,
					createElement(
						PanelBody,
						{ title: 'Guest Uploads', initialOpen: false },
						createElement(ToggleControl, {
							label: 'Allow Guest Uploads',
							checked: !!attributes.allow_guest_upload,
							onChange: (value) =>
								setAttributes({ allow_guest_upload: value }),
							help: 'Let guests upload files via this media field.',
						})
					)
				)
			);
		};
	}, 'withGuestUploadControl');

	addFilter(
		'editor.BlockEdit',
		'jfb-guest-uploads/with-guest-upload-control',
		withGuestUploadControl
	);
})(window.wp);
