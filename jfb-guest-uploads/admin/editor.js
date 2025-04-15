console.log("✅ JFB Guest Upload script loaded");

(function (wp) {
	const { addFilter } = wp.hooks;
	const { Fragment } = wp.element;
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
		return (props) => {
			if (props.name !== 'jet-forms/media-field') return <BlockEdit {...props} />;

			const { attributes, setAttributes } = props;

			return (
				<Fragment>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody title="Guest Uploads" initialOpen={false}>
							<ToggleControl
								label="Allow Guest Uploads"
								checked={!!attributes.allow_guest_upload}
								onChange={(value) =>
									setAttributes({ allow_guest_upload: value })
								}
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		};
	}, 'withGuestUploadControl');

	addFilter(
		'editor.BlockEdit',
		'jfb-guest-uploads/with-guest-upload-control',
		withGuestUploadControl
	);
})(window.wp);
