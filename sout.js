const errAssistiveAccess = -100;
const prefName = 'System Preferences';
const prefApp = Application(prefName);

function devices(table) {
	const indexToName = table.groups[0].buttons.name();
	const items = table.rows().map((row, index) => {
		const data = {};
		row.textFields().forEach((text, i) => {
			data[indexToName[i].toLowerCase()] = text.value();
		});
		return {
			title: data.name,
			subtitle: data.type,
			icon: {
				path: row.selected() ? 'sound.png' : 'no-sound.png'
			},
			arg: index
		};
	});

	return JSON.stringify({
		items
	});
}

function showSecurityAndPrivacyPane() {
	prefApp
		.panes.byId('com.apple.preference.security')
		.anchors.byName('Privacy_Accessibility')
		.reveal();
	prefApp.activate();
}

function error(err) {
	return JSON.stringify({
		items: [{
			title: err.toString(),
			arg: errAssistiveAccess
		}]
	});
}

function run(argv) {
	try {
		prefApp
			.panes.byId('com.apple.preference.sound')
			.anchors.byName('output')
			.reveal();

		delay(0.5);

		const deviceIndex = argv.length > 0 ? parseInt(argv[0], 10) : -1;
		const p = Application('System Events').processes[prefName];
		const table = p.windows[0].tabGroups[0].scrollAreas[0].tables[0];

		if (deviceIndex < 0) {
			switch (deviceIndex) {
				case errAssistiveAccess:
					showSecurityAndPrivacyPane();
					return;
				default:
					// show devices
					return devices(table);
			}
		}

		// select a device
		table.rows[deviceIndex].select();
	} catch (err) {
		return error(err);
	}
}

